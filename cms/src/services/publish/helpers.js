import { PUBLISH_ERRORS } from './constants';

export const getPublishErrorMessage = (publishError, modelName) => {
  switch (publishError) {
    case PUBLISH_ERRORS.noMatchingModel:
      return `Model ${modelName} was not found in the HCMI database.`;
    case PUBLISH_ERRORS.badRequest:
      return `There was a problem with the data in your publish request. Please ensure that all required fields are present and try again.`;
    default:
      return `An unexpected error occured during publish for model ${modelName}.`;
  }
};
