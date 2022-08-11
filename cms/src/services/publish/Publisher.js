import Model from '../../schemas/model';
import getPublishValidation from '../../validation/model';
import { runYupValidatorFailSlow } from '../../helpers';
import { PUBLISH_ERRORS } from './constants';
import { getPublishErrorMessage } from './helpers';
import { publishModel, bulkUpdateGeneSearchIndices } from '../elastic-search/publish';
import getLogger from '../../logger';

const logger = getLogger('services/publish/Publisher');

const PublishStatus = {
  active: 'ACTIVE',
  complete: 'COMPLETE',
  error: 'ERROR',
  stopped: 'STOPPED',
  waiting: 'WAITING',
};

const PublishTypes = {
  bulk: 'BULK',
  individual: 'INDIVIDUAL',
};

const PublishTask = ({
  modelName = null,
  error = null,
  status = PublishStatus.waiting,
  publishType = PublishTypes.individual,
}) => {
  const createdAt = Date.now();
  let acknowledged = false;
  let startTime = null;
  let stopTime = null;

  const start = async () => {
    status = PublishStatus.active;
    startTime = Date.now();
    logger.info({ startTime, modelName }, 'Publish started.');
    return await performPublish();
  };

  const stop = () => {
    status = PublishStatus.stopped;
    stopTime = Date.now();
    logger.info({ startTime, stopTime, modelName }, 'Publish stopped.');
  };

  const complete = () => {
    status = PublishStatus.complete;
    stopTime = Date.now();
    logger.info({ startTime, stopTime, modelName }, 'Publish complete.');
  };

  const errorStop = errorData => {
    status = PublishStatus.error;
    error = errorData;
    stopTime = Date.now();
    logger.info({ startTime, stopTime, modelName, error }, 'Publish stopped due to error.');
  };

  const acknowledge = () => {
    acknowledged = true;
  };

  const getData = () => ({
    acknowledged,
    createdAt,
    error,
    publishType,
    modelName,
    status,
    startTime,
    stopTime,
  });

  const performPublish = async () => {
    if (!modelName) {
      errorStop({
        code: PUBLISH_ERRORS.badRequest,
        message: `Unable to perform publish without a modelName.`,
      });
      return;
    }

    try {
      // early return if status changed mid-publish (due to manual stop)
      if (status !== PublishStatus.active) {
        return;
      }

      logger.debug({ time: Date.now(), startTime, modelName }, 'Beginning ES Publish...');

      await publishModel({ name: modelName }, publishType === PublishTypes.individual).then(() => {
        logger.debug({ time: Date.now(), startTime, modelName }, 'Completed Publish');
        complete();
      });
    } catch (error) {
      logger.error(error, 'Unexpected Publish Error');
      errorStop({ code: PUBLISH_ERRORS.unexpected, message: error.message, error });
    }
  };

  return {
    acknowledge,
    error,
    errorStop,
    getData,
    modelName,
    start,
    stop,
  };
};

const Publisher = (function() {
  let queue = [];
  let failed = [];
  let stopped = [];
  let success = [];
  let running = false;

  const cleanLists = () => {
    failed = failed.filter(i => i && i.getData && !i.getData().acknowledged);
    stopped = stopped.filter(i => i && i.getData && !i.getData().acknowledged);
    success = success.filter(i => i && i.getData && !i.getData().acknowledged);

    // queue should never have anything acknowledged (should move to failed/stopped/success)
    // clearing just in case
    queue = queue.filter(i => i && i.getData && !i.getData().acknowledged);
  };

  const emptyQueue = () => {
    queue = [];
  };

  const queueIndividualPublish = async modelName => {
    // Check for Model existence:
    const model = await Model.findOne({ name: modelName });
    if (!model) {
      return {
        error: {
          code: PUBLISH_ERRORS.noMatchingModel,
          message: getPublishErrorMessage(PUBLISH_ERRORS.noMatchingModel, modelName),
        },
      };
    }

    // Remove duplicate publish tasks
    stopPublish(modelName);
    acknowledge(modelName);

    try {
      const validation = await getPublishValidation();
      let newPublishTask;

      // Validate model before adding to queue
      await Model.find({
        name: modelName,
      })
        .populate('variants.variant')
        .then(model => runYupValidatorFailSlow(validation, model))
        .then(results => {
          if (results[0].success) {
            // Create new publish task
            newPublishTask = PublishTask({
              modelName,
            });

            // Add to queue
            queue.push(newPublishTask);
          } else {
            // Validation failed, create task with validation error
            newPublishTask = PublishTask({
              modelName: results[0].errors.name,
              status: PublishStatus.error,
              error: {
                code: PUBLISH_ERRORS.validationError,
                message: results[0].errors.details,
              },
            });

            // Add to failed
            failed.push(newPublishTask);
          }
        });

      // Start queue
      if (!running) {
        start();
      }

      return { success: true, startTime: Date.now() };
    } catch (error) {
      logger.error(error, 'Error occurred while adding individual publish task to queue.');
      return {
        error: {
          code: PUBLISH_ERRORS.unexpected,
          message: error.message,
          error,
        },
      };
    }
  };

  const convertModelIdsToModelNames = async modelIds => {
    const modelNames = await Model.find({ _id: { $in: modelIds } }).then(models =>
      models.map(model => model.name),
    );
    return modelNames;
  };

  const queueBulkPublish = async (models, ids = false) => {
    if (!Array.isArray(models) || models.length < 1) {
      logger.error(
        'queueBulkPublish failed due to bad input. `models` must be an array of model names.',
      );
      return {
        error: {
          code: PUBLISH_ERRORS.badRequest,
          message:
            'Unable to queue bulk import due to bad input. `models` must be an array of model names.',
        },
      };
    }

    // UI sends list of IDs instead of model names
    if (ids) {
      models = await convertModelIdsToModelNames(models);
    }

    // Remove duplicate imports
    stopBulkPublish(models);
    acknowledgeBulk(models);

    // Filter out models that don't exist within HCMI db
    let noMatchingModel = [];
    models = models.filter(async modelName => {
      let match = await Model.findOne({ name: modelName });

      if (!match) {
        noMatchingModel.push(modelName);
      }

      return match;
    });

    const validation = await getPublishValidation();
    let validationErrors = [];

    // Validate models for publishing
    const validModels = await Model.find({
      name: { $in: models },
    })
      .populate('variants.variant')
      .then(models => runYupValidatorFailSlow(validation, models))
      .then(validated => {
        const validModelNames = validated
          .filter(({ success }) => success)
          .map(({ result: { name } }) => name);

        // Put any validation errors into higher scope for return
        validationErrors = validated.filter(({ success }) => !success).map(({ errors }) => errors);

        return validModelNames;
      });

    // Add models which weren't found in HCMI db or failed validation
    failed = [
      ...failed,
      ...noMatchingModel.map(modelName =>
        PublishTask({
          modelName,
          status: PublishStatus.error,
          error: {
            code: PUBLISH_ERRORS.noMatchingModel,
            message: getPublishErrorMessage(PUBLISH_ERRORS.noMatchingModel, modelName),
          },
          publishType: PublishTypes.bulk,
        }),
      ),
      ...validationErrors.map(validationError =>
        PublishTask({
          modelName: validationError.name,
          status: PublishStatus.error,
          error: {
            code: PUBLISH_ERRORS.validationError,
            message: validationError.details,
          },
          publishType: PublishTypes.bulk,
        }),
      ),
    ];

    // Queue publish tasks for remaining models which were found
    queue = [
      ...queue,
      ...validModels.map(modelName => {
        return PublishTask({
          modelName,
          publishType: PublishTypes.bulk,
        });
      }),
    ];

    logger.debug({ time: Date.now(), models, noMatchingModel }, 'Beginning bulk publish queue...');

    // Start queue
    if (!running) {
      start();
    }

    return { success: true, startTime: Date.now() };
  };

  const stopPublish = async modelName => {
    // In case we get into an invalid state with multiple publish tasks for a given model,
    //   we'll use filter to get the whole list of them.
    const targets = queue.filter(i => i && i.modelName === modelName);
    if (targets.length) {
      targets.forEach(target => target.stop());
      stopped = [...stopped, ...targets];
      queue = queue.filter(i => i && i.modelName !== modelName);
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const stopBulkPublish = async (modelNames = []) => {
    pause();

    let targets = [];
    // if modelNames are provided, only stop those publish tasks
    // otherwise, stop all queued publish tasks
    if (modelNames.length) {
      modelNames.forEach(modelName => {
        targets = [...targets, ...queue.filter(i => i && i.modelName === modelName)];
      });
    } else {
      targets = queue;
    }

    if (targets.length) {
      targets.forEach(target => target.stop());
      stopped = [...stopped, ...targets];
      emptyQueue();
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const getStatus = () => {
    cleanLists();
    return {
      queue: queue.map(i => i.getData()),
      failed: failed.map(i => i.getData()),
      stopped: stopped.map(i => i.getData()),
      success: success.map(i => i.getData()),
      running,
    };
  };

  const acknowledge = modelName => {
    const targets = [
      ...failed.filter(i => i && i.modelName === modelName),
      ...stopped.filter(i => i && i.modelName === modelName),
      ...success.filter(i => i && i.modelName === modelName),
    ];
    if (targets.length) {
      targets.forEach(target => target.acknowledge());
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const acknowledgeBulk = modelNames => {
    let targets = [];

    modelNames.forEach(modelName => {
      targets = [
        ...targets,
        ...failed.filter(i => i && i.modelName === modelName),
        ...stopped.filter(i => i && i.modelName === modelName),
        ...success.filter(i => i && i.modelName === modelName),
      ];
    });

    if (targets.length) {
      targets.forEach(target => target.acknowledge());
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const updateBulkGeneSearchIndicies = async () => {
    const targets = [...success.filter(i => i.publishType === PublishTypes.bulk)];

    if (targets.length) {
      await bulkUpdateGeneSearchIndices(targets.map(model => model.modelName));
    }
  };

  const pause = () => {
    running = false;
  };

  const start = () => {
    running = true;
    run();
  };

  const run = async () => {
    if (queue.length > 0) {
      // Grab first item in queue and perform publish task
      const nextPublish = queue[0];
      await nextPublish.start();
      // Move from queue to appropriate list based on success/failure of publish
      switch (nextPublish.getData().status) {
        case PublishStatus.complete:
          success.push(queue.shift());
          break;
        case PublishStatus.error:
          failed.push(queue.shift());
          break;
        case PublishStatus.stopped:
          stopped.push(queue.shift());
          break;
        default:
          // Only get here if something went wrong and status wasn't updated
          // NOTE: upon testing, this did not ever happen...
          // Shouldn't be possible, just covering all bases
          logger.error(
            'Failed to update status following publish for model:',
            nextPublish.getData(),
          );
          // Remove from queue anyway to prevent infinite loop
          queue.shift();
          break;
      }
    }

    if (running && queue.length > 0) {
      run();
    } else {
      // Update gene search indices after bulk publish completes
      await updateBulkGeneSearchIndicies();
      pause();
    }
  };

  return {
    acknowledge,
    acknowledgeBulk,
    getStatus,
    queueIndividualPublish,
    queueBulkPublish,
    stopPublish,
    stopBulkPublish,
  };
})();

export default Publisher;
