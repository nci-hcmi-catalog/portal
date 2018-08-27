import express from 'express';
import { indexOneToES, indexUpdatesToES, indexAllToES } from '../services/elastic-search/sync-ES';

const publishRouter = express.Router();

publishRouter.post('/model/:modelId', async (req, res) => {
  const { modelId } = req.params;
  indexOneToES({
    _id: modelId,
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
