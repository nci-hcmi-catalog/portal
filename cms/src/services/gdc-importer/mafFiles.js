import axios from 'axios';
import qs from 'qs';
import { PassThrough } from 'stream';

import decompress from 'decompress';
import zlib from 'zlib';
import { get, flattenDeep, intersection, isEmpty } from 'lodash';

import {
  GDC_MODEL_STATES,
  GDC_CANCER_MODEL_SAMPLE_TYPES,
  GDC_GRAPHQL_BASE_URL,
  FETCH_CASE_ID_QUERY,
  FETCH_MODEL_FILE_DATA_QUERY,
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

export const fetchModelFileData = async modelNames => {
  if (!Array.isArray(modelNames) || !modelNames.length) {
    logger.error('fetchModelFileData failed due to invalid input. `modelNames` must be an array.', {
      modelNames,
      time: Date.now(),
    });
    return {};
  }

  const query = FETCH_MODEL_FILE_DATA_QUERY;
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
        const tumorDescriptor = get(sampleEdge, 'node.tumor_descriptor');
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
        return { sampleType, tissueType, tumorDescriptor, aliquots };
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
                tumorDescriptor: matchingSample.tumorDescriptor,
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

export const getMafStatus = mafFileData => {
  if (!mafFileData.success) {
    // Model not found in GDC
    return GDC_MODEL_STATES.modelNotFound;
  }

  const modelFiles = mafFileData.files;
  if (isEmpty(modelFiles)) {
    // No MAF files found for this model
    return GDC_MODEL_STATES.noMafs;
  }

  const cancerModelFiles = filterMafFilesBySampleTypes(
    modelFiles,
    Object.values(GDC_CANCER_MODEL_SAMPLE_TYPES),
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

export const getBulkMafStatus = bulkMafFileData => {
  const models = Object.keys(bulkMafFileData);
  const results = Object.values(GDC_MODEL_STATES).reduce((o, key) => ({ ...o, [key]: [] }), {});

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const mafFileData = bulkMafFileData[model];
    const mafStatus = getMafStatus(mafFileData);

    results[mafStatus].push(model);
  }

  return results;
};

export const getCancerModelFilesFromMafFileData = (mafFileData, bulk = false) => {
  switch (getMafStatus(mafFileData)) {
    case GDC_MODEL_STATES.singleNgcm:
      // Only one NGCM file, return it
      return filterMafFilesBySampleTypes(mafFileData.files, GDC_CANCER_MODEL_SAMPLE_TYPES.NGCM);
    case GDC_MODEL_STATES.singleNgcmPlusEngcm:
      if (bulk) {
        // For bulk imports, the ENGCM is ignored here. Just return the NGCM file
        return filterMafFilesBySampleTypes(mafFileData.files, GDC_CANCER_MODEL_SAMPLE_TYPES.NGCM);
      } else {
        // For individual imports, return both NGCM and ENGCM files
        return filterMafFilesBySampleTypes(
          mafFileData.files,
          Object.values(GDC_CANCER_MODEL_SAMPLE_TYPES),
        );
      }
    case GDC_MODEL_STATES.multipleNgcm:
      // Multiple NGCM files. Return them all
      return filterMafFilesBySampleTypes(mafFileData.files, GDC_CANCER_MODEL_SAMPLE_TYPES.NGCM);
    case GDC_MODEL_STATES.noNgcm:
      // No NGCM files, only ENGCMs available. Return them all
      return filterMafFilesBySampleTypes(mafFileData.files, GDC_CANCER_MODEL_SAMPLE_TYPES.ENGCM);
    default:
      return [];
  }
};

const filterMafFilesBySampleTypes = (files, sampleTypes) => {
  if (!files || !Array.isArray(files) || !files.length) {
    logger.error(
      'filterMafFilesBySampleTypes failed due to invalid input. `files` must be an array.',
      {
        files,
        time: Date.now(),
      },
    );
    return [];
  }

  if (!sampleTypes || !Array.isArray(sampleTypes) || !sampleTypes.length) {
    if (typeof sampleTypes === 'string') {
      sampleTypes = [sampleTypes];
    } else {
      logger.error(
        'filterMafFilesBySampleTypes failed due to invalid input. `sampleTypes` must be an array or a non-empty string.',
        {
          sampleTypes,
          time: Date.now(),
        },
      );
      return [];
    }
  }

  return files.filter(
    file => !isEmpty(intersection(file.entities.map(entity => entity.sampleType), sampleTypes)),
  );
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
