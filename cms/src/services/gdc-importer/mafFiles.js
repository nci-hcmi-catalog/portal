import axios from 'axios';
import qs from 'qs';
import { PassThrough } from 'stream';

import decompress from 'decompress';
import zlib from 'zlib';
import { get, flattenDeep, intersection, isEmpty } from 'lodash';

import {
  GDC_MODEL_STATES,
  IMPORT_ERRORS,
  GDC_NORMAL_SAMPLE_TYPES,
  GDC_CANCER_MODEL_SAMPLE_TYPES,
  GDC_GRAPHQL_BASE_URL,
  FETCH_CASE_ID_QUERY,
  FETCH_MODEL_FILE_DATA_QUERY,
  FETCH_BATCH_MODEL_FILE_DATA_QUERY,
} from './gdcConstants';

import getLogger from '../../logger';
const logger = getLogger('services/gdc-importer/mafFiles');

const fetchCaseId = async name => {
  const query = FETCH_CASE_ID_QUERY;
  const variables = {
    filter: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'cases.submitter_id',
            value: [name],
          },
        },
      ],
    },
  };

  const response = await axios.post(GDC_GRAPHQL_BASE_URL, { query, variables });

  return get(response, 'data.data.repository.cases.hits.edges[0].node.case_id', '');
};

const fetchModelFileData = async name => {
  const query = FETCH_MODEL_FILE_DATA_QUERY;
  const variables = {
    filter: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'cases.submitter_id',
            value: [name],
          },
        },
        {
          op: 'in',
          content: {
            field: 'files.access',
            value: ['open'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'files.data_format',
            value: ['maf'],
          },
        },
      ],
    },
  };

  const response = await axios.post(GDC_GRAPHQL_BASE_URL, { query, variables });

  const data = get(response, 'data.data.repository');
  if (data && get(data, 'cases.hits.edges[0].node.case_id')) {
    const caseId = get(data, 'cases.hits.edges[0].node.case_id');
    const samples = get(data, 'cases.hits.edges[0].node.samples.hits.edges', []).map(sampleEdge => {
      const sampleType = get(sampleEdge, 'node.sample_type');
      // const tissueType = get(sampleEdge, 'node.tissue_type');
      const aliquots = flattenDeep(
        get(sampleEdge, 'node.portions.hits.edges', []).map(portionEdge =>
          get(portionEdge, 'node.analytes.hits.edges', []).map(analyteEdge =>
            get(analyteEdge, 'node.aliquots.hits.edges', []).map(aliquot =>
              get(aliquot, 'node.aliquot_id'),
            ),
          ),
        ),
      );
      return { sampleType, aliquots };
    });
    logger.debug({ caseId, samples }, 'Case samples found for model');
    const files = get(data, 'files.hits.edges', []).map(fileEdge => {
      const fileId = get(fileEdge, 'node.file_id');
      const filename = get(fileEdge, 'node.file_name');
      const entityIds = get(fileEdge, 'node.associated_entities.hits.edges', []).map(entityEdge =>
        get(entityEdge, 'node.entity_id'),
      );

      const sampleTypes = entityIds.map(entity => {
        const matchingSample = samples.find(sample => sample.aliquots.includes(entity));
        if (matchingSample) {
          return matchingSample.sampleType;
        }
      });

      // NOTE: We fetch tissue_type but don't use it. If matching sample_type to find the file with the "Normal" value
      //    proves to have errors, a potential fix is to use tissue_type looking for the value "Normal" instead of matching sample_type

      return { fileId, filename, entityIds, sampleTypes, name };
    });
    logger.debug({ files }, 'Files found for model');

    return { caseId, files, success: true };
  } else {
    // Model not found
    return { caseId: null, files: null, success: false };
  }
};

export const fetchBatchModelFileData = async modelNames => {
  const query = FETCH_BATCH_MODEL_FILE_DATA_QUERY;
  const variables = {
    filter: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'cases.submitter_id',
            value: [...modelNames],
          },
        },
        {
          op: 'in',
          content: {
            field: 'files.access',
            value: ['open'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'files.data_format',
            value: ['maf'],
          },
        },
      ],
    },
    size: 32767,
  };

  const response = await axios.post(GDC_GRAPHQL_BASE_URL, { query, variables });

  const data = get(response, 'data.data.repository');
  const cases = get(data, 'cases.hits.edges');
  const results = modelNames.reduce((models, currentModelName) => {
    models[currentModelName] = {
      caseId: null,
      files: null,
      success: false,
    };

    return models;
  }, {});

  if (data && cases.length) {
    for (let i = 0; i < cases.length; i++) {
      const caseId = get(cases[i], 'node.case_id');
      const modelName = get(cases[i], 'node.submitter_id');

      const samples = get(cases[i], 'node.samples.hits.edges', []).map(sampleEdge => {
        const sampleType = get(sampleEdge, 'node.sample_type');
        const tissueType = get(sampleEdge, 'node.tissue_type');
        // aliquots will be an array of two ids
        const aliquots = flattenDeep(
          get(sampleEdge, 'node.portions.hits.edges', []).map(portionEdge =>
            get(portionEdge, 'node.analytes.hits.edges', []).map(analyteEdge =>
              get(analyteEdge, 'node.aliquots.hits.edges', []).map(aliquot =>
                get(aliquot, 'node.aliquot_id'),
              ),
            ),
          ),
        );
        return { sampleType, tissueType, aliquots };
      });

      logger.debug({ caseId, samples }, `Case samples found for model ${modelName}`);

      const files = get(data, 'files.hits.edges', [])
        .filter(fileEdge => {
          const entitySubmitterIds = get(fileEdge, 'node.associated_entities.hits.edges', []).map(
            entityEdge => get(entityEdge, 'node.entity_submitter_id'),
          );
          return entitySubmitterIds.some(submitterId => submitterId.includes(modelName));
        })
        .map(fileEdge => {
          const fileId = get(fileEdge, 'node.file_id');
          const filename = get(fileEdge, 'node.file_name');
          const entityIds = get(fileEdge, 'node.associated_entities.hits.edges', []).map(
            entityEdge => get(entityEdge, 'node.entity_id'),
          );

          const entities = entityIds
            .filter(entity => {
              return samples.some(sample => sample.aliquots.includes(entity));
            })
            .map(entity => {
              const matchingSample = samples.find(sample => sample.aliquots.includes(entity));
              return {
                entityId: entity,
                sampleType: matchingSample.sampleType,
                tissueType: matchingSample.tissueType,
              };
            });

          return { fileId, filename, entities };
        });

      logger.debug({ files }, `Files found for model ${modelName}`);

      results[modelName] = {
        caseId,
        files,
        success: true,
      };
    }
  }

  return results;
};

export const findMafFileData = async name => {
  const fileDataResponse = await fetchModelFileData(name);
  const modelFiles = fileDataResponse.files;
  if (!isEmpty(modelFiles)) {
    const targetFiles = modelFiles.filter(
      file =>
        !isEmpty(intersection(file.sampleTypes, GDC_NORMAL_SAMPLE_TYPES)) &&
        !isEmpty(intersection(file.sampleTypes, Object.values(GDC_CANCER_MODEL_SAMPLE_TYPES))),
    );
    logger.debug({ targetFiles }, 'Identified matching file(s)');
    switch (targetFiles.length) {
      case 1:
        // Get Url
        return { success: true, file: targetFiles[0] };
      case 0:
        // No files for this model with the correct sample types.
        return {
          success: false,
          error: { code: IMPORT_ERRORS.noMafs, caseId: fileDataResponse.caseId },
        };

      default:
        // More than one file found for this model that match the requirements.
        return {
          success: false,
          error: {
            code: IMPORT_ERRORS.multipleMafs,
            files: targetFiles.map(file => ({ fileId: file.fileId, filename: file.filename })),
          },
        };
    }
  } else {
    // No files found for this model.
    return { success: false, error: { code: IMPORT_ERRORS.modelNotFound } };
  }
};

export const checkMafStatus = mafFileData => {
  if (!mafFileData.success) {
    // Model not found in GDC
    return GDC_MODEL_STATES.modelNotFound;
  }

  const modelFiles = mafFileData.files;
  if (isEmpty(modelFiles)) {
    // No MAF files found for this model
    return GDC_MODEL_STATES.noMafs;
  }

  const cancerModelFiles = modelFiles.filter(
    file =>
      !isEmpty(
        intersection(
          file.entities.map(entity => entity.sampleType),
          Object.values(GDC_CANCER_MODEL_SAMPLE_TYPES),
        ),
      ),
  );
  if (isEmpty(cancerModelFiles)) {
    // No cancer models (NGCM/ENGCM) found for this model
    return GDC_MODEL_STATES.noMafs;
  }

  const { ngcmCount, engcmCount } = cancerModelFiles.reduce(
    (totals, currentModelFile) => {
      let currentNgcmCount = 0;
      let currentEngcmCount = 0;
      currentModelFile.entities.forEach(entity => {
        switch (entity.sampleType) {
          case GDC_CANCER_MODEL_SAMPLE_TYPES.NGCM:
            currentNgcmCount++;
            break;
          case GDC_CANCER_MODEL_SAMPLE_TYPES.ENGCM:
            currentEngcmCount++;
            break;
          default:
            break;
        }
      });
      return {
        ngcmCount: totals.ngcmCount + currentNgcmCount,
        engcmCount: totals.engcmCount + currentEngcmCount,
      };
    },
    { ngcmCount: 0, engcmCount: 0 },
  );

  switch (ngcmCount) {
    case 1:
      // exactly one NGCM found, can import it for bulk, user must choose for single import
      if (engcmCount > 0) {
        return GDC_MODEL_STATES.singleNgcmPlusEngcm;
      } else {
        return GDC_MODEL_STATES.singleNgcm;
      }
    case 0:
      // no NGCMs found, user must choose if they want ENGCM
      return GDC_MODEL_STATES.noNgcm;
    default:
      // multiple NGCMs found, user must choose
      return GDC_MODEL_STATES.multipleNgcm;
  }
};

export const downloadMaf = async ({ filename, fileId, modelName }) => {
  return new Promise(async (resolve, reject) => {
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
        bufs.push(data);
      });
      streamToBuffer.on('end', () => {
        decompress(Buffer.concat(bufs), {
          filter: file => file.path.includes(filename),
          strip: 1,
        })
          .then(files => {
            try {
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
      logger.error({ filename, fileId, modelName }, 'Error downloading file from GDC');
      reject(error);
    }
  });
};
