import express from 'express';
import Model from '../schemas/model';
import MatchedModel from '../schemas/matchedModels';

import MatchUtils from '../helpers/matchedModels';

const actionRouter = express.Router();

actionRouter.post('/connect/:name', async (req, res) => {
  const { name } = req.params;
  const { match } = req.body;

  try {
    const matchedModels = await MatchUtils.connectWithMatchedModels(name, match);
    res.status(200).json({
      success: true,
      message: 'Added to matched models.',
      matchedModels,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

actionRouter.delete('/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const matchedModels = await MatchUtils.removeFromSet(name);
    res.status(200).json({
      success: true,
      message: 'Removed from Matched Models set.',
      matchedModels,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

export default actionRouter;
