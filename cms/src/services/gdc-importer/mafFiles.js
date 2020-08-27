import axios from 'axios';
import qs from 'qs';
import { PassThrough } from 'stream';

import decompress from 'decompress';
import zlib from 'zlib';
import { get } from 'lodash';

import getLogger from '../../logger';
const logger = getLogger('services/gdc-importer/mafFiles');

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
      const aliquots = get(sampleEdge, 'node.portions.hits.edges', []).map(portionEdge => {
        // Making an assumption here that there will be 1 aliquot per portion, meaning we will take analytes[0] and aliquots[0]
        return get(
          portionEdge,
          'node.analytes.hits.edges[0].node.aliquots.hits.edges[0].node.aliquot_id',
        );
      });
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

      return { fileId, filename, entityIds, sampleTypes, name };
    });
    logger.debug({ files }, 'Files found for model');

    return files;
  }
};

// Note: This method intentionally throws errors to provide messaging about the cause of a failure.
//          Make sure any consumers of this handle errors
export const findMafFileData = async name => {
  logger.debug({ name }, 'Entering findMafFileData');

  const modelFiles = await fetchModelFileData(name);
  if (modelFiles) {
    const targetFiles = modelFiles.filter(
      file =>
        file.sampleTypes.includes('Blood Derived Normal') &&
        file.sampleTypes.includes('Next Generation Cancer Model'),
    );
    logger.debug({ targetFiles }, 'Identified mathcing file(s)');
    switch (targetFiles.length) {
      case 1:
        // Get Url
        return targetFiles[0];
      case 0:
        throw new Error('No files for this model with the correct sample types.');
        break;
      default:
        throw new Error('More than one file found for this model that match the requirements.');
    }
  } else {
    throw new Error('No files found for this model.');
  }
};

export const downloadMaf = async ({ filename, fileId, modelName }) => {
  return new Promise(async (resolve, reject) => {
    // const { filename, fileId, name: modelName } = fileData;
    logger.debug({ filename, fileId, modelName }, 'entering downloadMaf');

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
              logger.debug({ file: files[0].path }, 'MAF Download: Internal Compressed file ');
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
