import express from 'express';
import { unpublishOneFromES } from '../services/elastic-search/unpublish';

const unPublishRouter = express.Router();

unPublishRouter.post('/model/:modelId', async (req, res) => {
  const { modelId } = req.params;
  unpublishOneFromES(modelId)
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

export default unPublishRouter;
