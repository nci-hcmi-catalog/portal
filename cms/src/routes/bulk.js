// @ts-check

import express from 'express';
import Model from '../schemas/model';
import publishValidation from '../validation/model';
import { runYupValidatorFailSlow, modelStatus } from '../helpers';
import { indexOneToES } from '../services/elastic-search/publish';
import { unpublishManyFromES } from '../services/elastic-search/unpublish';
import csvStream from '../helpers/streamAsCSV';
import { backupFields } from '../schemas/descriptions/model';
const bulkRouter = express.Router();

bulkRouter.post('/publish', async (req, res) => {
  let validationErrors;
  // Validate models for publishing
  Model.find({
    _id: { $in: req.body },
  })
    .then(models => runYupValidatorFailSlow(publishValidation, models))
    .then(validated => {
      const validModelNames = validated
        .filter(({ success }) => success)
        .map(({ result: { name } }) => name);

      // Put any validation errors into higher scope for return
      validationErrors = validated.filter(({ success }) => !success).map(({ errors }) => errors);

      return validModelNames;
    })
    .then(async validModelNames => {
      for (const name of validModelNames) {
        try {
          await indexOneToES({ name });
        } catch (err) {
          validationErrors.push(err);
        }
      }
      for (const name of validModelNames) {
        // Now that everything has been published, lets make sure all the matched models for these are also updated in ES
        indexMatchedModelsToES({ name });
      }
      res.json({
        success: `${req.body.length - validationErrors.length} models published`,
        errors: validationErrors,
      });
    })
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

bulkRouter.post('/unpublish', async (req, res) => {
  let deleteCount = 0;

  Model.find({ _id: { $in: req.body } })
    .then(models => unpublishManyFromES(models.map(({ name }) => name)))
    .then(result => {
      deleteCount = result.deleted;
      return Model.updateMany(
        {
          _id: { $in: req.body },
        },
        { status: modelStatus.unpublished },
      );
    })
    .then(() => {
      for (const name of req.body) {
        // Now that everything has been published, lets make sure all the matched models for these are also updated in ES
        indexMatchedModelsToES({ name });
      }
    })
    .then(() => res.json({ success: `${deleteCount} models unpublished` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

bulkRouter.post('/delete', async (req, res) => {
  Model.find({ _id: { $in: req.body } })
    .then(models => {
      const modelsToUnpublish = models
        .filter(({ status }) => status !== modelStatus.unpublished)
        .map(({ name }) => name);
      return unpublishManyFromES(modelsToUnpublish);
    })
    .then(() =>
      Model.deleteMany({
        _id: { $in: req.body },
      }),
    )
    .then(() => res.json({ success: `${req.body.length} models deleted` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

bulkRouter.get('/backup', async (req, res) => {
  csvStream({
    schemaObj: Model,
    fields: backupFields,
    writeHeaders: true,
    exportFileName: 'models',
    response: res,
  });
});

export default bulkRouter;
