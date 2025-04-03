import MatchedModels from '../schemas/matchedModels';
import Model from '../schemas/model';
import { modelStatus } from './modelStatus';
import { uniq } from 'lodash';

import getLogger from '../logger';
const logger = getLogger('helpers/matchedModels');

/* Worker methods, take models as inputs */
const createMatchedModels = async models => {
  const modelIds = models.map(model => model._id);
  const matchedModels = await MatchedModels.create({ models: modelIds });
  logger.audit(
    { matchedModels, models: models.map(model => model.name) },
    'matched model set created',
    'Created matched models set',
  );

  for (let model of models) {
    model.matchedModels = matchedModels._id;
    model.status =
      model.status === modelStatus.unpublished
        ? modelStatus.unpublished
        : modelStatus.unpublishedChanges;
    model.save();
    logger.audit({ model: model.name }, 'model saved', 'Model updated to add matched model set');
  }
  return matchedModels;
};

const clearModelFromSets = async model => {
  // Get MatchedModels for this model

  if (!model.matchedModels) {
    // Model doesn't have any matches. Nothing to do.
    // TODO: We may want to do a sanity check across matched models for any entries that include this model and remove them all.
    return;
  }

  const matchedModels = await MatchedModels.findOne({ _id: model.matchedModels });
  if (matchedModels) {
    // only do operations on the matched set if we find it. if we didnt, no issue, we are removing this reference anyways
    matchedModels.models = matchedModels.models.filter(
      modelId => modelId.toString() !== model._id.toString(),
    );

    // We need to make sure that when these changes to our model are published,
    //  the models from the old matched set also have their
    //  matched models updated.
    model.updateOldMatchesOnPublish = model.updateOldMatchesOnPublish
      ? model.updateOldMatchesOnPublish.concat(matchedModels.models)
      : matchedModels.models;

    model.updateOldMatchesOnPublish = uniq(model.updateOldMatchesOnPublish);

    if (matchedModels.models.length <= 1) {
      // Only one entry left in this set, we need to remove the set and remove it from the other model
      const otherModels = await Model.find({ _id: { $in: [matchedModels.models] } });
      for (let otherModel of otherModels) {
        otherModel.matchedModels = null;
        otherModel.status =
          otherModel.status === modelStatus.unpublished
            ? modelStatus.unpublished
            : modelStatus.unpublishedChanges;
        await otherModel.save();
        logger.audit(
          { model: otherModel.name },
          'model saved',
          'Model updated to remove matched model set',
        );
      }
      await MatchedModels.deleteOne({ _id: matchedModels._id });
      logger.audit(
        { matchedModels },
        'matched model set removed',
        'Matched models set removed due to having 1 or fewer members after update',
      );
    } else {
      await matchedModels.save();
      logger.audit({ matchedModels }, 'matched model set saved', 'Matched models set updated');
    }
  } else {
    logger.warn(
      { name: model.name, matchedModels: model.matchedModels },
      `Attempted to find matched models that doesn't exist in DB`,
    );
  }
  // Clear the matchedModels reference from this model
  model.matchedModels = null;
  model.status =
    model.status === modelStatus.unpublished
      ? modelStatus.unpublished
      : modelStatus.unpublishedChanges;
  await model.save();
  logger.audit({ model: model.name }, 'model saved', 'Model updated to remove matched model set');

  return;
};

/* Exported Methods, take Model Names as inputs */
/**
 * Clears the matchedModels for the given model and updates models in the old set to no longer include this model
 * @param {*} nameToAdd
 */
const removeFromSet = async nameToRemove => {
  const model = await Model.findOne({ name: nameToRemove });
  if (!model) {
    throw new Error(`Could not find model with the name: ${nameToRemove}.`);
  }
  return await clearModelFromSets(model);
};

/**
 * Add a model to the set that setMemberName belongs to
 * The method will first remove the model from any current sets.
 * @param {*} nameToAdd
 * @param {*} setMemberName
 * @returns {matchedModels, models} matchedModels is the Mongo ID of the matchedModel set, and models is an array of the model names in thet set
 */
const connectWithMatchedModels = async (nameToAdd, setMemberName) => {
  const modelToAdd = await Model.findOne({ name: nameToAdd });
  if (!modelToAdd) {
    throw new Error(`Could not find model with the name: ${nameToAdd}.`);
  }
  if (nameToAdd === setMemberName) {
    throw new Error('Model name and match name are the same.');
  }

  const currentMatchedModels = modelToAdd.matchedModels
    ? await MatchedModels.findOne({ _id: modelToAdd.matchedModels }).populate('models')
    : null;
  const inCurrentSet =
    currentMatchedModels && currentMatchedModels.models.find(model => model.name === setMemberName);

  // Only continue if we have to, if:
  // a - the target model name (setMemberName) is not in the current matchedModels set
  // b - its not currently part of a set
  if (!currentMatchedModels || !inCurrentSet) {
    // Remove model from any current set
    await clearModelFromSets(modelToAdd);

    // Fetch this after the clear, cause it could be modified by the clear if the models were in teh same set
    const modelFromSet = await Model.findOne({ name: setMemberName });
    if (!modelFromSet) {
      throw new Error(`Could not find model with the name: ${setMemberName}.`);
    }

    if (modelFromSet.matchedModels) {
      const matchedModels = await MatchedModels.findOne({ _id: modelFromSet.matchedModels });

      // Add model to the set
      matchedModels.models.push(modelToAdd._id);
      await matchedModels.save();
      logger.audit(
        { matchedModels, model: nameToAdd },
        'matched model set updated',
        'Matched models set updated to add new model',
      );

      // Add reference to the set to the model
      modelToAdd.matchedModels = matchedModels._id;
      modelToAdd.status =
        modelToAdd.status === modelStatus.unpublished
          ? modelStatus.unpublished
          : modelStatus.unpublishedChanges;
      await modelToAdd.save();
      logger.audit(
        { model: modelToAdd.name },
        'model saved',
        'Model updated to add to matched model set',
      );

      return matchedModels;
    } else {
      // No existing set, make a new one
      // Note that createMatchedModels also adds the reference to each model in the list.
      const matchedModels = await createMatchedModels([modelToAdd, modelFromSet]);

      return matchedModels;
    }
  } else {
    return {
      models: currentMatchedModels.models.map(model => model._id),
      _id: currentMatchedModels._id,
      __v: currentMatchedModels.__v,
    };
  }
};

const matchedModels = {
  removeFromSet,
  connectWithMatchedModels,
};

export default matchedModels;
