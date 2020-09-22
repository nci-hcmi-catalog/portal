import tsv from 'tsv';

import Model from '../../schemas/model';
import { findMafFileData, downloadMaf } from './mafFiles';
import { addGenomicVariantsFromMaf } from '../../helpers/genomicVariants';

import getLogger from '../../logger';
const logger = getLogger('services/gdc-importer/VariantImporter');

const ImportStatus = {
  active: 'ACTIVE',
  stopped: 'STOPPED',
  complete: 'COMPLETE',
  error: 'ERROR',
};

const Import = function(modelName, fileId, filename) {
  const startTime = Date.now();

  let stopTime = null;

  let status = ImportStatus.active;
  let error = null;
  let acknowledged = false;

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

  const acknowledge = () => {
    acknowledged = true;
  };

  const getData = () => ({ status, error, startTime, stopTime, acknowledged, fileId, filename });

  const parseMaf = maf => {
    // clear all the weird comments
    const withoutComments = maf.replace(/#.+\n/g, '');
    return tsv.parse(withoutComments);
  };

  const performDataImport = async () => {
    logger.debug(
      { time: Date.now(), startTime, fileId, filename, modelName },
      'Beginning MAF file download...',
    );
    try {
      if (status !== ImportStatus.active) {
        return;
      }
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
      errorStop({ code: 'UNKNOWN', message: error.message });
    }
  };

  // Actual importer work:
  try {
    if (filename && fileId) {
      performDataImport();
    }
  } catch (error) {
    logger.error(error, 'Unknown error occurred calling performDataImport.');
    errorStop({ code: 'Unknown', message: error.message });
  }
  return { modelName, getData, stop, errorStop, acknowledge };
};

const VariantImporter = (function() {
  let imports = [];

  const summarizeImport = item => {
    const data = item.getData();
    return {
      startTime: data.startTime,
      stopTime: data.stopTime,
      status: data.status,
      error: data.error,
      name: item.modelName,
      fileId: data.fileId,
      filename: data.filename,
    };
  };

  const cleanImportsList = () => {
    imports = imports.filter(i => {
      const data = i.getData();

      const stopped = ImportStatus.stopped === data.status;
      const acknowledgedError = ImportStatus.error === data.status && data.acknowledged;
      const acknowledgedComplete = ImportStatus.complete === data.status && data.acknowledged;

      return !(stopped || acknowledgedError || acknowledgedComplete);
    });
  };

  const startImport = async modelName => {
    // check for Model existence:
    const model = await Model.findOne({ name: modelName });
    if (!model) {
      return { error: `No model with name: ${modelName}` };
    }

    // Make sure we don't have duplicate imports running.
    stopImport(modelName);

    try {
      const mafFileResponse = await findMafFileData(modelName);
      if (mafFileResponse.success) {
        const fileData = mafFileResponse.file;
        const result = Import(modelName, fileData.fileId, fileData.filename);
        imports.push(result);
        return summarizeImport(result);
      } else {
        const result = Import(modelName, null, null);
        result.errorStop(mafFileResponse.error);
        imports.push(result);
        return summarizeImport(result);
      }
    } catch (error) {
      // Need handling for different error cases.
      logger.error(error, 'Error occurred while fetching MAF file URL from GDC');
      return { error: 'Communication error occurred with GDC.' };
    }
  };

  const stopImport = async modelName => {
    // In case we get into an invalid state with multiple imports for a given model name,
    //   we'll use filter to get the whole list of them.
    const targets = imports.filter(i => i.modelName === modelName);
    if (targets.length) {
      targets.forEach(target => target.stop());
    }

    cleanImportsList();

    return targets.map(summarizeImport);
  };

  const getImports = () => {
    cleanImportsList();

    return imports.map(summarizeImport);
  };

  const acknowledgeCompleted = modelName => {
    const targets = imports.filter(
      i =>
        i.modelName === modelName &&
        [ImportStatus.complete, ImportStatus.error].includes(i.getData().status),
    );
    if (targets.length) {
      targets.forEach(target => target.acknowledge());
    }

    cleanImportsList();

    return imports.map(summarizeImport);
  };

  return {
    startImport,
    stopImport,
    getImports,
    acknowledgeCompleted,
  };
})();

export default VariantImporter;
