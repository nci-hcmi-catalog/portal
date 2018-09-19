// @ts-check

import express from 'express';
import Model from '../schemas/model';
import publishValidation from '../validation/model';
import { runYupValidators } from '../helpers';
import { indexModelsToES } from '../services/elastic-search/publish';

const publishRouter = express.Router();

publishRouter.post('/', async (req, res) => {
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
    .then(data => res.json(data))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

export default publishRouter;
