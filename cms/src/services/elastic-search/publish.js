import { ModelES } from './common/schemas/model';
import Model from '../../schemas/model';
import getPublishValidation from '../../validation/model';
import { modelStatus } from '../../helpers/modelStatus';
import MatchUtils from '../../helpers/matchedModels';
import indexEsUpdate from './update';
import { updateGeneSearchIndicies } from './genomicVariants';

import { get } from 'lodash';

import getLogger from '../../logger';
const logger = getLogger('services/elastic-search/publish');

export const publishModel = async filter => {
  await indexOneToES(filter);
  await indexMatchedModelsToES(filter);
  await updateGeneSearchIndicies();
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
        const validation = await getPublishValidation();
        // Validate doc against publish schema
        // for "on-demand" publishing
        validation
          .validate(doc)
          .then(async () => {
            // Need to populate and filter the matched models
            if (doc.matchedModels) {
              const matchedModels = await ModelES.find({
                _id: { $in: doc.matchedModels.models || [] },
              });
              const matches = matchedModels.filter(
                model => model.status !== modelStatus.unpublished && model.name !== doc.name,
              );
              doc.populatedMatches = matches;
            }
            doc.esIndex((err, res) => {
              if (err) {
                reject(err);
              } else {
                indexEsUpdate() &&
                  resolve({
                    status: `Indexing successful with status: ${res.result}`,
                  });
                logger.audit({ model: doc }, 'publish model', 'Model Published to ES');
              }
            });
          })
          .then(
            async () =>
              await Model.updateOne({ name: doc.name }, { status: modelStatus.published }),
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

  // Get list of matched models if exists
  const matchedModelIds = model.matchedModels ? model.matchedModels.models : [];
  if (model.matchedModels && matchedModelIds.length <= 1) {
    // if list of matched models exists but only includes itself, we can remove the whole matched model set.
    logger.warn(
      `Model ${model.name} is part of a small or empty matchedModel set of length ${
        matchedModelIds.length
      }, deleting the set and the reference in the model.`,
    );
    await MatchUtils.removeFromSet(model.name);
  }

  if (model.updateOldMatchesOnPublish) {
    // if we need to update old matches, we can do that here
    matchedModelIds.push(...model.updateOldMatchesOnPublish);
  }

  await updateMatchedModelsToES({
    _id: { $in: matchedModelIds.filter(id => id.toString() !== model._id.toString() || !skipSelf) },
  });

  if (model.updateOldMatchesOnPublish) {
    // Remove the updateMatchedModels list now that we've updated them.
    await Model.updateOne(filter, { updateOldMatchesOnPublish: [] });
  }
};

export const updateMatchedModelsToES = async filter => {
  const models = await ModelES.find(filter);

  // filter this list only to models that are published or published with changes
  const modelsToPublish = models.filter(model => model.status !== modelStatus.unpublished);

  logger.debug(
    { matchedModels: modelsToPublish.map(model => model.name) },
    'Updating matched models',
  );
  for (let model of modelsToPublish) {
    // Publish this model to ensure it has matchedModel updates, unless skepSelf is true and this model is the one named in the method argument name
    logger.debug({ model: model.name }, `Publishing model in order to update Matched Models.`);
    await indexOneToES({ name: model.name });
  }
};
