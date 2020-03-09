import { ModelES } from './common/schemas/model';
import publishValidation from '../../validation/model';
import { modelStatus } from '../../helpers/modelStatus';
import MatchUtils from '../../helpers/matchedModels';
import indexEsUpdate from './update';

import { get } from 'lodash';

export const publishModel = async filter => {
  try {
    await indexOneToES(filter);
    await indexMatchedModelsToES(filter);
  } catch (err) {
    throw err;
  }
};

export const indexOneToES = filter => {
  return new Promise((resolve, reject) => {
    ModelES.findOne(filter)
      .populate('variants.variant')
      .populate('matchedModels')
      .exec(async (err, doc) => {
        if (err) {
          reject(err);
        }

        // Need to populate and filter the matched models
        if (doc.matchedModels) {
          const matchedModels = await ModelES.find({
            _id: { $in: doc.matchedModels.models || [] },
          });
          const matches = matchedModels.filter(model => {
            return model.status === modelStatus.published && model.name !== doc.name;
          });
          doc.populatedMatches = matches;
        } else {
          doc.populatedMatches = [];
        }

        // Validate doc against publish schema
        // for "on-demand" publishing
        publishValidation
          .validate(doc)
          .then(
            doc.esIndex((err, res) => {
              err
                ? reject(err)
                : // Not waiting for promise to resolve as this is just bookkeeping
                  indexEsUpdate() &&
                  resolve({
                    status: `Indexing successful with status: ${res.result}`,
                  });
            }),
          )
          .catch(err => reject(err));
      });
  });
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
  const model = await ModelES.findOne(filter).populate('matchedModels');

  if (!model.matchedModels) {
    // No matched Models, nothing to do.
    return;
  }

  const matchedModelIds = model.matchedModels.models || [];
  if (matchedModelIds.length <= 1) {
    console.warn(
      `Model ${model.name} is part of a small or empty matchedModel set of length ${
        matchedModelIds.length
      }, deleting the set and the reference in the model.`,
    );
    await MatchUtils.removeFromSet(model.name);
    return;
  }

  if (model.updateOldMatchesOnPublish) {
    matchedModelIds.push(...model.updateOldMatchesOnPublish);
  }

  console.log('id', model._id.toString());
  console.log('matchedModelIds', matchedModelIds);
  console.log('skipSelf', skipSelf);

  await updateMatchedModelsToES({
    _id: { $in: matchedModelIds.filter(id => !skipSelf || id.toString() !== model._id.toString()) },
  });

  if (model.updateOldMatchesOnPublish) {
    // Remove the updateMatchedModels list now that we've updated them.
    model.updateOldMatchesOnPublish = [];
    model.save();
  }
};

export const updateMatchedModelsToES = async filter => {
  console.log('filter', filter);
  const models = await ModelES.find(filter);

  // filter this list only to models that are published or published with changes
  const modelsToPublish = models.filter(model => model.status !== modelStatus.unpublished);

  console.log('modelsToPublish', modelsToPublish.map(model => model.name));
  for (let modelToPublish of modelsToPublish) {
    // Publish this model to ensure it has matchedModel updates, unless skepSelf is true and this model is the one named in the method argument name
    console.log(`Publishing ${modelToPublish.name} in order to update Matched Models.`);
    await indexOneToES({ name: modelToPublish.name });

    modelToPublish.status = modelStatus.published;
    await modelToPublish.save();
  }
};
