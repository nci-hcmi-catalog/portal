// @ts-check

import express from 'express';
import { indexModelsToES } from '../services/elastic-search/publish';

const publishRouter = express.Router();

publishRouter.post('/', async (req, res) => {
  indexModelsToES({
    _id: { $in: req.body },
  })
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: error,
      }),
    );
});

// publishRouter.post('/updated', async (req, res) => {
//   indexUpdatesToES()
//     .then(data => res.json(data))
//     .catch(error =>
//       res.json({
//         error: error,
//       }),
//     );
// });

// publishRouter.post('/all', async (req, res) => {
//   indexAllToES()
//     .then(data => res.json(data))
//     .catch(error =>
//       res.json({
//         error: error,
//       }),
//     );
// });

export default publishRouter;
