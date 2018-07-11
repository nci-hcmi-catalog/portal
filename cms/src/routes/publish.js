import express from 'express';
import { indexOneToES, indexUpdatesToES, indexAllToES } from '../services/publish/sync-ES';
export const publish_router = express.Router();

publish_router.post('/:modelId', async (req, res) => {
  const { modelId } = req.params;
  indexOneToES({
    id: modelId,
  })
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: `Error Indexing document ${modelId}, ${error}`,
      }),
    );
});

publish_router.post('/updates', async (req, res) => {
  indexUpdatesToES()
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: `Error Indexing documents, ${error}`,
      }),
    );
});

publish_router.post('/all', async (req, res) => {
  indexAllToES()
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: `Error Indexing documents, ${error}`,
      }),
    );
});
