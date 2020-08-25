import axios from 'axios';
import qs from 'qs';
import { PassThrough } from 'stream';

import decompress from 'decompress';
import zlib from 'zlib';

import Model from '../../schemas/model';
import { findMafFileData } from './mafFiles';

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
  let errors = [];
  let acknowledged = false;

  const stop = () => {
    status = ImportStatus.stopped;
    stopTime = Date.now();
  };

  const acknowledge = () => {
    acknowledged = true;
  };

  const getStatus = () => status;
  const getErrors = () => errors;

  const getData = () => ({ status, errors, startTime, stopTime, acknowledged, fileId, filename });

  const downloadFile = async () => {
    return new Promise(async (resolve, reject) => {
      logger.debug(
        { time: Date.now(), startTime, fileId, filename },
        'Beginning MAF file download',
      );

      const url = 'https://portal.gdc.cancer.gov/auth/api/data?annotations=true&related_files=true';
      const body = {
        size: 10000,
        attachment: true,
        format: 'JSON',
        filters: {},
        pretty: true,
        filename: filename,
        ids: fileId,
        // downloadCookieKey:11dbbe146,
        // downloadCookiePath:/
      };

      try {
        const response = await axios.post(url, qs.stringify(body), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'stream',
        });
        const downloadStream = response.data;

        const streamToBuffer = new PassThrough();
        const bufs = [];
        streamToBuffer.on('data', data => {
          logger.debug('on data');
          bufs.push(data);
        });
        streamToBuffer.on('end', () => {
          logger.debug('ended buffer stream');
          decompress(Buffer.concat(bufs), {
            filter: file => file.path.includes(filename),
            strip: 1,
          })
            .then(files => {
              try {
                logger.debug(files[0].path, 'done decompress');
                const maf = zlib.gunzipSync(files[0].data).toString('utf8');

                resolve(maf);
              } catch (error) {
                logger.error(
                  { error, filename, fileId, modelName },
                  'Error decompressing internal MAF file from GDC download',
                );
                reject(error);
              }
            })
            .catch(error => {
              logger.error(
                { error, filename, fileId, modelName },
                'Failure decompressing file from GDC',
              );
              reject(error);
            });
        });

        downloadStream.pipe(streamToBuffer);
      } catch (error) {
        logger.error({ error, filename, fileId, modelName }, 'Error downloading file from GDC');
        reject(error);
      }
    });
  };

  const performDataImport = async () => {
    const mafFile = await downloadFile();
    logger.debug('Completed Maf File Download');
  };

  // Actual importer work:
  performDataImport();
  return { modelName, getData, stop, acknowledge };
};

const VariantImporter = (function() {
  let imports = [];

  const summarizeImport = item => {
    const data = item.getData();
    return {
      startTime: data.startTime,
      stopTime: data.stopTime,
      status: data.status,
      errors: data.errors,
      name: item.modelName,
      fileId: data.fileId,
      filename: data.filename,
    };
  };

  const cleanImportsList = () => {
    imports = imports.filter(i => {
      const data = i.getData();

      const stopped = ImportStatus.stopped === data.status;
      const acknowledgedError = ImportStatus.error === data.status;

      data.acknowledged;
      const acknowledgedComplete = ImportStatus.complete === data.status;

      data.acknowledged;

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
      const fileData = await findMafFileData(modelName);

      const result = Import(modelName, fileData.fileId, fileData.filename);
      imports.push(result);

      return summarizeImport(result);
    } catch (error) {
      // Need handling for different error cases.

      logger.error({ error }, 'Error occurred while fetching MAF file URL from GDC');
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
        i.modelName ===
        modelName[(ImportStatus.complete, ImportStatus.error)].includes(i.getData().status),
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
