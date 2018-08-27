import express from 'express';
import { indexOneToES, indexUpdatesToES, indexAllToES } from '../services/elastic-search/publish';

const publishRouter = express.Router();

publishRouter.post('/model/:modelName', async (req, res) => {
  const { modelName } = req.params;
  indexOneToES({
    name: modelName,
  })
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

publishRouter.post('/updated', async (req, res) => {
  indexUpdatesToES()
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

publishRouter.post('/all', async (req, res) => {
  indexAllToES()
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

export default publishRouter;
