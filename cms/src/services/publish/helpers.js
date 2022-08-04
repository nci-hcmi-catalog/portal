import { PUBLISH_ERRORS } from './constants';

export const getPublishErrorMessage = (publishError, modelName) => {
  switch (publishError) {
    case PUBLISH_ERRORS.noMatchingModel:
      return `No local model found with matching name ${modelName}.`;
    case PUBLISH_ERRORS.badRequest:
      return `Unable to perform publish without modelName.`;
    default:
      return `An unexpected error occured during publish for ${modelName}.`;
  }
};
