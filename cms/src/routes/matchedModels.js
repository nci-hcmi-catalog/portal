import express from 'express';
import MatchUtils from '../helpers/matchedModels';

import getLogger from '../logger';
const logger = getLogger('routes/matchedModels');

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
    logger.error(
      { model: name, match, error },
      `Unexpected error connecting model (${name}) to matchedModel (${match})`,
    );
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
    logger.error(
      { ...error, model: name },
      'Unexpected error removing model from matched model set',
    );
    res.status(500).json({
      error: error.message,
    });
  }
});

export default actionRouter;
