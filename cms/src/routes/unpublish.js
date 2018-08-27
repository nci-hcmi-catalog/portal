import express from 'express';
import { unpublishOneFromES } from '../services/elastic-search/unpublish';

const unPublishRouter = express.Router();

unPublishRouter.post('/model/:modelName', async (req, res) => {
  const { modelName } = req.params;
  unpublishOneFromES(modelName)
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

export default unPublishRouter;
