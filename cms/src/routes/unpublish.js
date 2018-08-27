import express from 'express';
import { indexOneToES } from '../services/elastic-search/sync-ES';

const unPublishRouter = express.Router();

unPublishRouter.post('/model/:modelId', async (req, res) => {
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

export default unPublishRouter;
