import express from 'express';
import { indexUpdatesToES, indexAllToES } from '../services/elastic-search/publish';

const publishRouter = express.Router();

// TODO - make sure these update status or rewrite
// as a status updatethat triggers the publish
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
