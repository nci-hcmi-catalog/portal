import tsv from 'tsv';

import Model from '../../schemas/model';
import { GDC_MODEL_STATES, IMPORT_ERRORS } from './gdcConstants';
import {
  downloadMaf,
  fetchModelFileData,
  getMafStatus,
  getBulkMafStatus,
  getCancerModelFilesFromMafFileData,
} from './mafFiles';
import { addGenomicVariantsFromMaf, getGdcImportErrorMessage } from '../../helpers/genomicVariants';
import getLogger from '../../logger';

const logger = getLogger('services/gdc-importer/VariantImporter');

const ImportStatus = {
  active: 'ACTIVE',
  complete: 'COMPLETE',
  error: 'ERROR',
  stopped: 'STOPPED',
  waiting: 'WAITING',
};

const Import = ({
  modelName = null,
  fileId = null,
  filename = null,
  error = null,
  actionable = false,
  files = [],
  status = ImportStatus.waiting,
}) => {
  const createdAt = Date.now();
  let acknowledged = false;
  let startTime = null;
  let stopTime = null;

  const start = async () => {
    status = ImportStatus.active;
    startTime = Date.now();
    logger.info({ startTime, modelName }, 'Genomic Variant Import started.');
    return await performDataImport();
  };

  const stop = () => {
    status = ImportStatus.stopped;
    stopTime = Date.now();
    logger.info({ startTime, stopTime, modelName }, 'Genomic Variant Import stopped.');
  };

  const complete = () => {
    status = ImportStatus.complete;
    stopTime = Date.now();
    logger.info({ startTime, stopTime, modelName }, 'Genomic Variant Import complete.');
  };

  const errorStop = errorData => {
    status = ImportStatus.error;
    error = errorData;
    stopTime = Date.now();
    logger.info(
      { startTime, stopTime, modelName, error },
      'Genomic Variant Import stopped due to error.',
    );
  };

  const resolveConflict = (_fileId, _filename) => {
    status = ImportStatus.waiting;
    error = null;
    fileId = _fileId;
    filename = _filename;
    logger.info(
      { modelName, fileId, filename, time: Date.now() },
      'Genomic Variant Import error resolved.',
    );
  };

  const acknowledge = () => {
    acknowledged = true;
  };

  const getData = () => ({
    acknowledged,
    actionable,
    createdAt,
    error,
    fileId,
    filename,
    files,
    modelName,
    status,
    startTime,
    stopTime,
  });

  const parseMaf = maf => {
    // clear all the weird comments
    const withoutComments = maf.replace(/#.+\n/g, '');
    return tsv.parse(withoutComments);
  };

  const performDataImport = async () => {
    if (!modelName || !fileId || !filename) {
      errorStop({
        code: IMPORT_ERRORS.badRequest,
        message: `Unable to perform data import for model ${modelName} due to missing modelName, fileId, or filename.`,
      });
      return;
    }

    try {
      if (status !== ImportStatus.active) {
        return;
      }
      logger.debug(
        { time: Date.now(), startTime, fileId, filename, modelName },
        'Beginning MAF file download...',
      );
      const mafFile = await downloadMaf({ filename, fileId, modelName });

      if (status !== ImportStatus.active) {
        return;
      }
      const mafData = parseMaf(mafFile);
      logger.debug(
        { time: Date.now(), startTime, fileId, filename, modelName },
        'MAF Data downloaded. Beginning model updates...',
      );

      if (status !== ImportStatus.active) {
        return;
      }
      await addGenomicVariantsFromMaf(modelName, mafData, { filename, fileId });
      logger.debug(
        { time: Date.now(), startTime, fileId, filename, modelName },
        'Completed Genomic Variant Import',
      );

      if (status !== ImportStatus.active) {
        return;
      }
      complete();
    } catch (error) {
      logger.error(error, 'Import Async Error');
      errorStop({ code: IMPORT_ERRORS.unexpected, message: error.message, error });
    }
  };

  return {
    acknowledge,
    error,
    errorStop,
    getData,
    modelName,
    resolveConflict,
    start,
    stop,
  };
};

const VariantImporter = (function() {
  let queue = [];
  let failed = [];
  let stopped = [];
  let success = [];
  let running = false;

  const cleanLists = () => {
    failed = failed.filter(i => !i.getData().acknowledged);
    stopped = stopped.filter(i => !i.getData().acknowledged);
    success = success.filter(i => !i.getData().acknowledged);

    // queue should never have anything acknowledged (should move to failed/stopped/success)
    // clearing just in case
    queue = queue.filter(i => !i.getData().acknowledged);
  };

  const emptyQueue = () => {
    queue = [];
  };

  const queueImport = async (modelName, fileId, filename) => {
    // Check for Model existence:
    const model = await Model.findOne({ name: modelName });
    if (!model) {
      return {
        error: {
          code: IMPORT_ERRORS.noMatchingModel,
          message: getGdcImportErrorMessage(IMPORT_ERRORS.noMatchingModel, modelName),
        },
      };
    }

    // Make sure we don't have duplicate imports queued up
    stopImport(modelName);

    try {
      let newImport;

      // When fileId and filename are provided, can queue import immediately
      if (fileId && filename) {
        newImport = Import({ modelName, fileId, filename });

        queue.push(newImport);

        // Start queue
        if (!running) {
          start();
        }

        return { success: true, startTime: Date.now() };
      }

      // Otherwise, MAF data must be downloaded to find fileId and filename
      const mafFileDataResponse = await fetchModelFileData([modelName]);
      const mafFileData = mafFileDataResponse[modelName];
      const mafStatus = getMafStatus(mafFileData);

      switch (mafStatus) {
        // Can import without user action, proceed normally
        case GDC_MODEL_STATES.singleNgcm:
          const fileData = getCancerModelFilesFromMafFileData(mafFileData)[0];
          newImport = Import({
            modelName,
            fileId: fileData.fileId,
            filename: fileData.filename,
          });
          break;
        // Actionable error (more than one MAF option)
        case GDC_MODEL_STATES.singleNgcmPlusEngcm:
        case GDC_MODEL_STATES.multipleNgcm:
        case GDC_MODEL_STATES.noNgcm:
          newImport = Import({
            modelName,
            status: ImportStatus.error,
            error: {
              code: mafStatus,
              message: getGdcImportErrorMessage(mafStatus, modelName),
            },
            actionable: true,
            files: getCancerModelFilesFromMafFileData(mafFileData),
          });
          break;
        // Non-actionable error (model not found or no MAFs)
        default:
          newImport = Import({
            modelName,
            status: ImportStatus.error,
            error: {
              code: mafStatus,
              message: getGdcImportErrorMessage(mafStatus, modelName),
            },
          });
          break;
      }

      // Add to appropriate queue
      if (newImport && !newImport.error) {
        queue.push(newImport);
      } else {
        failed.push(newImport);
      }

      // Start queue
      if (!running) {
        start();
      }

      return { success: true, startTime: Date.now() };
    } catch (error) {
      logger.error(error, 'Error occurred while adding MAF file import to queue.');
      return {
        error: {
          code: IMPORT_ERRORS.unexpected,
          message: error.message,
          error,
        },
      };
    }
  };

  const queueBulkImport = async models => {
    if (!Array.isArray(models) || models.length < 1) {
      logger.error(
        'queueBulkImport failed due to bad input. `models` must be an array of model names.',
      );
      return {
        error: {
          code: IMPORT_ERRORS.badRequest,
          message:
            'Unable to queue bulk import due to bad input. `models` must be an array of model names.',
        },
      };
    }

    cleanLists();

    // Filter out models that don't exist within HCMI db
    let noMatchingModel = [];
    models = models.filter(async modelName => {
      let match = await Model.findOne({ name: modelName });

      if (!match) {
        noMatchingModel.push(modelName);
      }

      return match;
    });

    logger.debug(
      { time: Date.now(), models, noMatchingModel },
      'Beginning bulk import queue, fetching bulk file data...',
    );
    const modelsFileData = await fetchModelFileData(models);
    const modelsStatus = getBulkMafStatus(modelsFileData);

    // Create predictable errors based on MAF status
    failed = [
      ...failed,
      // Non-actionable errors (no match, not found in GDC, no MAFs)
      ...noMatchingModel.map(modelName =>
        Import({
          modelName,
          status: ImportStatus.error,
          error: {
            code: IMPORT_ERRORS.noMatchingModel,
            message: getGdcImportErrorMessage(IMPORT_ERRORS.noMatchingModel, modelName),
          },
        }),
      ),
      ...modelsStatus[GDC_MODEL_STATES.modelNotFound].map(modelName =>
        Import({
          modelName,
          status: ImportStatus.error,
          error: {
            code: GDC_MODEL_STATES.modelNotFound,
            message: getGdcImportErrorMessage(GDC_MODEL_STATES.modelNotFound, modelName),
          },
        }),
      ),
      ...modelsStatus[GDC_MODEL_STATES.noMafs].map(modelName =>
        Import({
          modelName,
          status: ImportStatus.error,
          error: {
            code: GDC_MODEL_STATES.noMafs,
            message: getGdcImportErrorMessage(GDC_MODEL_STATES.noMafs, modelName),
          },
        }),
      ),
      // Actionable errors (multiple ngcm, no ngcm)
      ...modelsStatus[GDC_MODEL_STATES.multipleNgcm].map(modelName =>
        Import({
          modelName,
          status: ImportStatus.error,
          error: {
            code: GDC_MODEL_STATES.multipleNgcm,
            message: getGdcImportErrorMessage(GDC_MODEL_STATES.multipleNgcm, modelName),
          },
          actionable: true,
          files: getCancerModelFilesFromMafFileData(modelsFileData[modelName], true),
        }),
      ),
      ...modelsStatus[GDC_MODEL_STATES.noNgcm].map(modelName =>
        Import({
          modelName,
          status: ImportStatus.error,
          error: {
            code: GDC_MODEL_STATES.noNgcm,
            message: getGdcImportErrorMessage(GDC_MODEL_STATES.noNgcm, modelName),
          },
          actionable: true,
          files: getCancerModelFilesFromMafFileData(modelsFileData[modelName], true),
        }),
      ),
    ];

    // Queue imports for conflict-free models (single NGCM, single NGCM+)
    queue = [
      ...queue,
      ...modelsStatus[GDC_MODEL_STATES.singleNgcm].map(modelName => {
        const fileData = getCancerModelFilesFromMafFileData(modelsFileData[modelName], true)[0];
        return Import({
          modelName,
          fileId: fileData.fileId,
          filename: fileData.filename,
        });
      }),
      ...modelsStatus[GDC_MODEL_STATES.singleNgcmPlusEngcm].map(modelName => {
        const fileData = getCancerModelFilesFromMafFileData(modelsFileData[modelName], true)[0];
        return Import({
          modelName,
          fileId: fileData.fileId,
          filename: fileData.filename,
        });
      }),
    ];

    // Start queue
    if (!running) {
      start();
    }

    return { success: true, startTime: Date.now() };
  };

  const stopImport = async modelName => {
    // In case we get into an invalid state with multiple imports for a given model name,
    //   we'll use filter to get the whole list of them.
    const targets = queue.filter(i => i.modelName === modelName);
    if (targets.length) {
      targets.forEach(target => target.stop());
      stopped = [...stopped, ...targets];
      queue = queue.filter(i => i.modelName !== modelName);
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const stopBulkImport = async () => {
    pause();

    const targets = queue;
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
      ...failed.filter(i => i.modelName === modelName),
      ...stopped.filter(i => i.modelName === modelName),
      ...success.filter(i => i.modelName === modelName),
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
        ...failed.filter(i => i.modelName === modelName),
        ...stopped.filter(i => i.modelName === modelName),
        ...success.filter(i => i.modelName === modelName),
      ];
    });

    if (targets.length) {
      targets.forEach(target => target.acknowledge());
    }

    cleanLists();

    return targets.map(target => target.getData());
  };

  const resolveConflict = (modelName, fileId, filename) => {
    const targetIndex = failed.findIndex(i => i.modelName === modelName);

    if (targetIndex < 0) {
      return {
        success: false,
        error: {
          code: IMPORT_ERRORS.noMatchingModel,
          message: `An error for ${modelName} was not found.`,
        },
      };
    }

    // Move resolved conflict from failed to queue
    const target = failed.splice(targetIndex, 1)[0];
    target.resolveConflict(fileId, filename);
    queue.push(target);

    // Start queue
    if (!running) {
      start();
    }

    return target.getData();
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
      // Grab first item in queue and perform data import
      const nextImport = queue[0];
      await nextImport.start();
      // Move from queue to appropriate list based on success/failure of import
      switch (nextImport.getData().status) {
        case ImportStatus.complete:
          success.push(queue.shift());
          break;
        case ImportStatus.error:
          failed.push(queue.shift());
          break;
        case ImportStatus.stopped:
          stopped.push(queue.shift());
          break;
        default:
          // Something went wrong and status wasn't updated
          // NOTE: upon testing, this did not ever happen
          // It shouldn't be possible, just covering all bases
          logger.error(
            'Import Status failed to update following import for model:',
            nextImport.getData(),
          );
          // Remove from queue anyway to prevent infinite loop
          queue.shift();
          break;
      }
    }

    if (running && queue.length > 0) {
      run();
    } else {
      pause();
    }
  };

  return {
    acknowledge,
    acknowledgeBulk,
    getStatus,
    queueImport,
    queueBulkImport,
    resolveConflict,
    stopImport,
    stopBulkImport,
  };
})();

export default VariantImporter;
