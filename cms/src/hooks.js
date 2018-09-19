import { indexOneToES } from './services/elastic-search/publish';
import { unpublishOneFromES } from './services/elastic-search/unpublish';
import { modelStatus, runYupValidators } from './helpers';
import { deleteImage } from './routes/images';
import { saveValidation } from './validation/model';

export const validateYup = (req, res, next) => {
  runYupValidators(saveValidation, [req.body])
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

export const preUpdate = (req, res, next) => {
  runYupValidators(saveValidation, [req.body])
    .then(async () => {
      const {
        body,
        erm: { model },
      } = req;
      if (model.modelName.toLowerCase() === 'model' && body && 'status' in body) {
        if (body.status === modelStatus.published) {
          // mongoose document is not avaiable in the hook unless findOneAndUpdate is false
          // findOneAndUpdate is used elsewhere, so we need to manually find the doc
          const modelDoc = await model.findById(body._id);
          const toDelete = modelDoc.files.filter(f => f.marked_for_deletion).map(f => f._id);

          return Promise.all(toDelete.map(id => deleteImage(id))).then(() => {
            const remainingFiles = modelDoc.files.filter(f => !toDelete.includes(f._id));
            // setting and saving the mongoose doc here returns correct state but
            // does not seem to commit it. Setting req body does.
            req.body.files = remainingFiles;
          });
        }
      }
    })
    .then(() => next())
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
};

export const postUpdate = async (req, res, next) => {
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
