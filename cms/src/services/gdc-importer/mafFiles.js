import axios from 'axios';
import qs from 'qs';
import { PassThrough } from 'stream';

import decompress from 'decompress';
import zlib from 'zlib';
import { get, flattenDeep, intersection, isEmpty } from 'lodash';

import getLogger from '../../logger';
const logger = getLogger('services/gdc-importer/mafFiles');

export const IMPORT_ERRORS = {
  multipleMafs: 'MULTIPLE_MAFS',
  noMafs: 'NO_MAFS',
  modelNotFound: 'MODEL_NOT_FOUND',
};

const GDC_NORMAL_SAMPLE_TYPES = [
  'Blood Derived Normal',
  'Solid Tissue Normal',
  'Bone Marrow Normal',
  'Buccal Cell Normal',
  'EBV Immortalized Normal',
  'Mononuclear Cells from Bone Marrow Normal',
  'Lymphoid Normal',
  'Fibroblasts from Bone Marrow Normal',
  'Tumor Adjacent Normal - Post Neo-adjuvant Therapy',
];

const GDC_CANCER_MODEL_SAMPLE_TYPES = [
  'Expanded Next Generation Cancer Model',
  'Next Generation Cancer Model',
];

const fetchCaseId = async name => {
  const url = 'https://portal.gdc.cancer.gov/auth/api/v0/graphql/';
  const query = `
    query ($filter: FiltersArgument) {
      repository {
        cases {
          hits(filters: $filter) {
            edges {
              node {
                case_id
              }
            }
          }
        }
      }
    }
  `;
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

  const response = await axios.post(url, { query, variables });

  return get(response, 'data.data.repository.cases.hits.edges[0].node.case_id', '');
};

const fetchModelFileData = async name => {
  const url = 'https://portal.gdc.cancer.gov/auth/api/v0/graphql/';
  const query = `query ($filter: FiltersArgument) {
        repository {
          files {
            hits(filters: $filter) {
              total
              edges {
                node {
                  file_id
                  file_name
                  associated_entities {
                    hits {
                      edges {
                        node {
                          entity_id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cases {
            hits(filters: $filter) {
              total
              edges {
                node {
                  samples {
                    hits {
                      total
                      edges {
                        node {
                          sample_type
                          tissue_type
                          portions {
                            hits {
                              total
                              edges {
                                node {
                                  analytes {
                                    hits {
                                      total
                                      edges {
                                        node {
                                          aliquots {
                                            hits {
                                              total
                                              edges {
                                                node {
                                                  aliquot_id
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`;
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

  const response = await axios.post(url, { query, variables });

  const output = [];

  const data = get(response, 'data.data.repository');
  if (data) {
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
    logger.debug({ samples }, 'Case samples found for model');
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

    return files;
  }
};

export const findMafFileData = async name => {
  const modelFiles = await fetchModelFileData(name);
  if (!isEmpty(modelFiles)) {
    const targetFiles = modelFiles.filter(
      file =>
        !isEmpty(intersection(file.sampleTypes, GDC_NORMAL_SAMPLE_TYPES)) &&
        !isEmpty(intersection(file.sampleTypes, GDC_CANCER_MODEL_SAMPLE_TYPES)),
    );
    logger.debug({ targetFiles }, 'Identified mathcing file(s)');
    switch (targetFiles.length) {
      case 1:
        // Get Url
        return { success: true, file: targetFiles[0] };
      case 0:
        // No files for this model with the correct sample types.
        return { success: false, error: { code: IMPORT_ERRORS.noMafs } };

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
