import _ from 'lodash';
import mongoose from 'mongoose';

import Model from '../../schemas/model.js';
import getPublishValidation from '../../validation/model.js';
import { modelStatus } from '../../helpers/modelStatus.js';
import MatchUtils from '../../helpers/matchedModels.js';
import getLogger from '../../logger.js';

import indexLastUpdated from './indexLastUpdated.js';
import indexModel from './indexModel.js';
import { updateGeneSearchIndicies } from './genomicVariants.js';

const logger = getLogger('services/searchClient/publish');

export const publishModel = async (filter, individualPublish = true) => {
  await indexOneToES(filter);
  await indexMatchedModelsToES(filter);

  // For individual publishes, update gene search indices immediately (if required)
  if (individualPublish) {
    const modelWithVariantChanges = await Model.findOne({ ...filter, variants_modified: true });
    if (modelWithVariantChanges) {
      await updateGeneSearchIndicies();
      modelWithVariantChanges.variants_modified = false;
      await modelWithVariantChanges.save();
    }
  }
};

// For bulk publishes, update gene search indices after all models are published
export const bulkUpdateGeneSearchIndices = async (modelNames) => {
  const modelsWithVariantChanges = await Model.find({
    name: { $in: modelNames },
    variants_modified: true,
  });

  if (modelsWithVariantChanges.length) {
    await updateGeneSearchIndicies();
    // Reset the `variants_modified` flag to false now that gene search indices have been updated
    await Model.updateMany(
      { name: { $in: modelNames }, variants_modified: true },
      { $set: { variants_modified: false } },
    );
  }
};

/****
 * Removes Mongoose specific keys & values to prepare data for Search indexing
 */
const cleanMongoDoc = (doc) => {
  const mongoKeys = ['_id', '__v'];
  let cleanedDoc = _.omit(doc, mongoKeys);
  for (const key in cleanedDoc) {
    const value = cleanedDoc[key];
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        const firstEntry = value[0];
        const cleanedVals =
          firstEntry && typeof firstEntry === 'object'
            ? value.map((val) => {
                const cleanedValue = _.omit(val, mongoKeys);
                return cleanedValue;
              })
            : value;
        cleanedDoc[key] = cleanedVals;
      } else if (value instanceof mongoose.Types.ObjectId) {
        cleanedDoc[key] = value.toString();
      } else if (!(value instanceof Date)) {
        const cleanedValue = _.omit(value, mongoKeys);
        cleanedDoc[key] = cleanedValue;
      }
    }
  }
  return cleanedDoc;
};

export const indexOneToES = async (filter) => {
  try {
    const validation = await getPublishValidation();
    const doc = await Model.findOne(filter)
      .populate('variants.variant')
      .populate('matchedModels')
      .exec();

    // Validate doc against publish schema for "on-demand" publishing
    await validation.validate(doc);

    // Need to populate and filter the matched models, and format data for indexing
    const modelRecord = doc.toObject();
    if (modelRecord.matchedModels) {
      const matchedModels = await Model.find({
        _id: { $in: modelRecord.matchedModels.models || [] },
      });
      const matches = matchedModels
        .filter((model) => model.status !== modelStatus.unpublished && model.name !== doc.name)
        .map((record) => cleanMongoDoc(record.toObject()));

      modelRecord.populatedMatches = matches;
      modelRecord.has_matched_models = true;
    }

    const cleanedDoc = cleanMongoDoc(modelRecord);

    // Index model into ElasticSearch
    await indexModel(doc._id, cleanedDoc);
    await indexLastUpdated();

    const res = await Model.updateOne({ name: doc.name }, { status: modelStatus.published });

    logger.info({ model: doc.name }, 'publish model', 'Model Published to ES');
    return {
      status: `Indexing successful with status: ${res.result}`,
    };
  } catch (err) {
    logger.error('Error at indexOneToES', err);
    throw err;
  }
};

/**
 * Provided a Model Name, this will find the matched model set for that model, and re-publish all other
 *  members of that matched set.
 * This is needed since when a model in a set is published all members of that set need to have their
 *  matched model content updated to include the new published details.
 * @param String updatedModelName is the Name of a model, all the other published members of its
 *  matchedModel set will be republished.
 */
export const indexMatchedModelsToES = async (filter, skipSelf = true) => {
  const model = await Model.findOne(filter).populate('matchedModels');

  // Get list of matched models if exists
  const matchedModelIds = model.matchedModels ? model.matchedModels.models : [];
  if (model.matchedModels && matchedModelIds.length <= 1) {
    // if list of matched models exists but only includes itself, we can remove the whole matched model set.
    logger.warn(
      `Model ${model.name} is part of a small or empty matchedModel set of length ${matchedModelIds.length}, deleting the set and the reference in the model.`,
    );
    await MatchUtils.removeFromSet(model.name);
  }

  if (model.updateOldMatchesOnPublish) {
    // if we need to update old matches, we can do that here
    matchedModelIds.push(...model.updateOldMatchesOnPublish);
  }

  await updateMatchedModelsToES({
    _id: {
      $in: matchedModelIds.filter((id) => id.toString() !== model._id.toString() || !skipSelf),
    },
  });

  if (model.updateOldMatchesOnPublish) {
    // Remove the updateMatchedModels list now that we've updated them.
    await Model.updateOne(filter, { updateOldMatchesOnPublish: [] });
  }
};

export const updateMatchedModelsToES = async (filter) => {
  const models = await Model.find(filter);

  // filter this list only to models that are published or published with changes
  const modelsToPublish = models.filter((model) => model.status !== modelStatus.unpublished);

  logger.debug(
    { matchedModels: modelsToPublish.map((model) => model.name) },
    'Updating matched models',
  );
  for (let model of modelsToPublish) {
    // Publish this model to ensure it has matchedModel updates, unless skepSelf is true and this model is the one named in the method argument name
    logger.debug({ model: model.name }, `Publishing model in order to update Matched Models.`);
    await indexOneToES({ name: model.name });
  }
};
