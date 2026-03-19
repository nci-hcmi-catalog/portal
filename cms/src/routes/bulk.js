// @ts-check

import express from 'express';

import Model from '../schemas/model.js';
import getPublishValidation from '../validation/model.js';
import { runYupValidatorFailSlow, modelStatus } from '../helpers/index.js';
import { indexOneToES, indexMatchedModelsToES } from '../services/searchClient/publish.js';
import { unpublishManyFromES } from '../services/searchClient/unpublish.js';
import csvStream from '../helpers/streamAsCSV.js';
import { backupFields } from '../schemas/descriptions/model.js';
import { updateGeneSearchIndicies } from '../services/searchClient/genomicVariants.js';
import getLogger from '../logger.js';

const logger = getLogger('routes/bulk');
const bulkRouter = express.Router();

bulkRouter.post('/publish', async (req, res) => {
  const validation = await getPublishValidation();
  let validationErrors = [];
  // Validate models for publishing
  Model.find({
    _id: { $in: req.body },
  })
    .populate('variants.variant')
    .then((models) => runYupValidatorFailSlow(validation, models))
    .then((validated) => {
      const validModelNames = validated
        .filter(({ success }) => success)
        .map(({ result: { name } }) => name);

      // Put any validation errors into higher scope for return
      validationErrors = validated.filter(({ success }) => !success).map(({ errors }) => errors);

      return validModelNames;
    })
    .then(async (validModelNames) => {
      for (const name of validModelNames) {
        try {
          await indexOneToES({ name });
        } catch (err) {
          validationErrors.push(err);
        }
      }
      for (const name of validModelNames) {
        // Now that everything has been published, lets make sure all the matched models for these are also updated in ES
        await indexMatchedModelsToES({ name });
      }

      // Only update gene search indices when variants/genes have been modified
      const modelsWithVariantChanges = await Model.find({
        name: { $in: validModelNames },
        variants_modified: true,
      });
      if (modelsWithVariantChanges.length) {
        await updateGeneSearchIndicies();
        // Reset the `variants_modified` flag to false now that gene search indices have been updated
        await Model.updateMany(
          { name: { $in: validModelNames }, variants_modified: true },
          { $set: { variants_modified: false } },
        );
      }
      return res.json({
        success: `${req.body.length - validationErrors.length} models published`,
        errors: validationErrors,
      });
    })
    .catch((error) => {
      logger.error(error);
      return res.status(500).json({
        error: error,
      });
    });
});

bulkRouter.post('/unpublish', async (req, res) => {
  let deleteCount = 0;

  try {
    const models = await Model.find({ _id: { $in: req.body } });
    const result = await unpublishManyFromES(models.map(({ name }) => name));
    deleteCount = result.deleted;
    await Model.updateMany(
      {
        _id: { $in: req.body },
      },
      { status: modelStatus.unpublished },
    );

    for (const _id of req.body) {
      // Now that everything has been published, lets make sure all the matched models for these are also updated in ES
      await indexMatchedModelsToES({ _id });
    }
    await updateGeneSearchIndicies();
    return res.json({ success: `${deleteCount} models unpublished` });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      error: error,
    });
  }
});

bulkRouter.post('/delete', async (req, res) => {
  Model.find({ _id: { $in: req.body } })
    .then((models) => {
      const modelsToUnpublish = models
        .filter(({ status }) => status !== modelStatus.unpublished)
        .map(({ name }) => name);
      return unpublishManyFromES(modelsToUnpublish);
    })
    .then(async () => {
      for (const _id of req.body) {
        // Now that everything has been published, lets make sure all the matched models for these are also updated in ES
        await indexMatchedModelsToES({ _id });
      }
      await updateGeneSearchIndicies();
    })
    .then(() =>
      Model.deleteMany({
        _id: { $in: req.body },
      }),
    )
    .then(() => {
      return res.json({ success: `${req.body.length} models deleted` });
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).json({
        error: error,
      });
    });
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
