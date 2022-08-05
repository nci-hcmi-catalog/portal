import express from 'express';
import Publisher from '../services/publish/Publisher';
import { PUBLISH_ERRORS } from '../services/publish/constants';

import getLogger from '../logger';

const logger = getLogger('routes/publish');

const publishRouter = express.Router();

/* Description of Endpoints

1. Get Publish Queue Status
  GET /publish/status
    - Request lists of async publish operations currently running
    Input: none
    Output: object with lists of publish jobs in various states (queue, failed, success, stopped)

2. Publish (Bulk)
  POST /publish/bulk
    - Fetch data for all specified models
    - Validate data for specified models
    - Add valid models to queue and start queue, add errors to error queue
    Input: list of model names in request body
    Output: success if models were added to queues and queue was started without issue, error otherwise

3. Publish (Single Model)
  POST /publish/:name
    - Fetch model data
    - Validate model
    - Add publish to queue if possible and start the queue, or return an error
    Input: model name
    Output: success if valid model and added to queue, error otherwise

4. Acknowledge Publish Activity Has Been Seen (Bulk)
  POST /publish/acknowledge/bulk
    - Acknowledges that the user has seen the publish activity (success, error, stopped) for a list of models
    Input: list of model names in request body
    Output: success if models were found in queue and acknowledged, and data for acknowledged models

5. Acknowledge Publish Activity Has Been Seen (Single Model)
  POST /publish/acknowledge/:name
    - Acknowledges that the user has seen the publish activity (success, error, stopped) for a model
    Input: model name
    Output: success if model was found in queue and acknowledged, and data for acknowledged model

6. Stop Publish (Bulk)
  POST /publish/stop/all
    - Stops all waiting models from being published
    Input: none
    Output: success if models were stopped, and data for stopped models

7. Stop Publish (Single Model)
  POST /publish/stop/:name
    - Stops a given model from being published if it has not already been processed
    Input: model name
    Output: success if model was found in queue and stopped, and data for stopped model
*/

publishRouter.get('/status', async (req, res) => {
  try {
    logger.debug(`Fetching Publisher status...`);

    const status = Publisher.getStatus();

    res.status(200).json({ ...status });
  } catch (error) {
    logger.error(error, `Error occurred during Publisher status fetch`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/bulk', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'Bulk publish failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      success: false,
      error: {
        code: PUBLISH_ERRORS.badRequest,
        message:
          'Bulk publish failed due to a bad request. `models` must be an array of model names.',
      },
    });
  }

  try {
    logger.debug(`Starting bulk publish for models: ${models}`);

    const result = await Publisher.queueBulkPublish(models);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, startTime: result.startTime });
  } catch (error) {
    logger.error(error, `Error occurred during bulk publish`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/:name', async (req, res) => {
  const { name } = req.params;

  try {
    logger.debug(`Starting publish for model ${name}`);

    const result = await Publisher.queueIndividualPublish(name);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, startTime: result.startTime });
  } catch (error) {
    logger.error(error, `Error occurred while queueing publish task for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/acknowledge/bulk', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'Bulk acknowledge failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      success: false,
      error: {
        code: PUBLISH_ERRORS.badRequest,
        message:
          'Bulk acknowledge failed due to a bad request. `models` must be an array of model names.',
      },
    });
  }

  try {
    logger.debug(`Starting bulk acknowledge for models: ${models}`);

    const acknowledged = Publisher.acknowledgeBulk(models);

    res.status(200).json({ acknowledged, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during bulk model acknowledge`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/acknowledge/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Acknowledging publish status for model ${name}`);

    const acknowledged = Publisher.acknowledge(name);

    res.status(200).json({ acknowledged, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during publish status acknowledgement for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/stop/all', async (req, res) => {
  try {
    logger.debug(`Stopping import for all queued models`);

    const stopped = await Publisher.stopBulkPublish();

    res.status(200).json({ stopped, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during bulk publish stop`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

publishRouter.post('/stop/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Stopping publish for model ${name}`);

    const stopped = await Publisher.stopPublish(name);

    res.status(200).json({ stopped, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during publish stop for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

export default publishRouter;
