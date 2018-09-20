// @ts-check

import express from 'express';
import Model from '../schemas/model';
import publishValidation from '../validation/model';
import { runYupValidators, modelStatus } from '../helpers';
import { indexModelsToES } from '../services/elastic-search/publish';
import { unpublishManyFromES } from '../services/elastic-search/unpublish';

const bulkRouter = express.Router();

bulkRouter.post('/publish', async (req, res) => {
  // Validate models for publishing
  Model.find({
    _id: { $in: req.body },
  })
    .then(models => runYupValidators(publishValidation, models))
    .then(validModels => {
      const ids = validModels.map(({ _id }) => _id);
      return indexModelsToES({
        _id: { $in: ids },
      });
    })
    .then(() => res.json({ success: `${req.body.length} models published` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

bulkRouter.post('/unpublish', async (req, res) => {
  Model.find({ _id: { $in: req.body } })
    .then(models => unpublishManyFromES(models.map(({ name }) => name)))
    .then(() =>
      Model.updateMany(
        {
          _id: { $in: req.body },
        },
        { status: modelStatus.unpublished },
      ),
    )
    .then(() => res.json({ success: `${req.body.length} models unpublished` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

bulkRouter.post('/delete', async (req, res) => {
  Model.find({ _id: { $in: req.body } })
    .then(models => unpublishManyFromES(models.map(({ name }) => name)))
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

export default bulkRouter;
