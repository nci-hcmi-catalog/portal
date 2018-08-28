import { runYupValidators } from './routes/sync-data';
import { indexOneToES } from './services/elastic-search/publish';
import { unpublishOneFromES } from './services/elastic-search/unpublish';
import { modelStatus } from './schemas/constants';

export const validateYup = (req, res, next) => {
  runYupValidators([req.body])
    .then(() => next())
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
};

export const preModelDelete = (req, res, next) => {
  unpublishOneFromES(req.params.id)
    .then(() => next())
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
};

export const postUpdate = (req, res, next) => {
  const {
    body,
    erm: {
      result,
      model: { modelName },
    },
  } = req;

  // Model updates that contain the status key we
  // treat as being a change in status and trigger
  // an update to elastic search
  if (modelName.toLowerCase() === 'model' && body && 'status' in body) {
    switch (result.status) {
      case modelStatus.published:
        return indexOneToES({ name: result.name })
          .then(() => next())
          .catch(err => next(err));
      case modelStatus.unpublished:
        return unpublishOneFromES(result.name)
          .then(() => next())
          .catch(err => next(err));
      default:
        return next();
    }
  }

  return next();
};
