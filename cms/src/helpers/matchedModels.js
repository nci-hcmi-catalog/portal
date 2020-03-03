import MatchedModels from '../schemas/matchedModels';
import Model from '../schemas/model';

/* Worker methods, take models as inputs */
const createMatchedModels = async models => {
  const modelIds = models.map(model => model._id);
  const matchedModels = await MatchedModels.create({ models: modelIds });

  for (let model of models) {
    model.matchedModels = matchedModels._id;
    model.save();
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
      item => item.toString() !== model._id.toString(),
    );

    if (matchedModels.models.length <= 1) {
      // Only one entry left in this set, we need to remove the set and remove it from the other model
      const otherModels = await Model.find({ _id: { $in: [matchedModels.models] } });
      for (let otherModel of otherModels) {
        otherModel.matchedModels = null;
        await otherModel.save();
      }
      await MatchedModels.deleteOne({ _id: matchedModels._id });
    } else {
      await matchedModels.save();
    }
  } else {
    console.warn(
      `Tried to find matched models that doesn't exist in DB - model: ${
        model.name
      }, matchedModels: ${model.matchedModels}`,
    );
  }
  // Clear the matchedModels reference from this model
  model.matchedModels = null;
  await model.save();

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
    throw new Error(`Could not find model with the name: ${nameToAdd}.`);
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

    // Add reference to the set to the model
    modelToAdd.matchedModels = matchedModels._id;
    await modelToAdd.save();

    return matchedModels;
  } else {
    // No existing set, make a new one
    // Note that createMatchedModels also adds the reference to each model in the list.
    const matchedModels = await createMatchedModels([modelToAdd, modelFromSet]);

    return matchedModels;
  }
};

export default {
  removeFromSet,
  connectWithMatchedModels,
};
