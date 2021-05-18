export const GDC_MODEL_STATES = {
  modelNotFound: 'MODEL_NOT_FOUND',
  noMafs: 'NO_MAFS',
  singleNgcm: 'SINGLE_NGCM',
  singleNgcmPlusEngcm: 'SINGLE_NGCM_PLUS_ENGCM',
  multipleNgcm: 'MULTIPLE_NGCM',
  noNgcm: 'NO_NGCM',
};

export const IMPORT_ERRORS = {
  // No local model matching input modelName
  noMatchingModel: 'NO_MATCHING_MODEL',
  // Malformed input for request
  badRequest: 'BAD_REQUEST',
  // Async/communication error with GDC
  gdcCommunicationError: 'GDC_COMMUNICATION_ERROR',
  // Unexpected error
  unexpected: 'UNEXPECTED',
};

export const IMPORT_OVERWRITE_OPTIONS = {
  cleanOnly: 'CLEAN_ONLY',
  allModels: 'ALL_MODELS',
  none: 'NONE',
};

export const GDC_NORMAL_SAMPLE_TYPES = [
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

export const GDC_CANCER_MODEL_SAMPLE_TYPES = {
  ENGCM: 'Expanded Next Generation Cancer Model',
  NGCM: 'Next Generation Cancer Model',
};

export const GDC_GRAPHQL_BASE_URL = 'https://portal.gdc.cancer.gov/auth/api/v0/graphql';

export const FETCH_CASE_ID_QUERY = `
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

export const FETCH_MODEL_FILE_DATA_QUERY = `query ($filter: FiltersArgument, $size: Int) {
  repository {
    files {
      hits(filters: $filter, first: $size) {
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
                    entity_submitter_id
                  }
                }
              }
            }
          }
        }
      }
    }
    cases {
      hits(filters: $filter, first: $size) {
        total
        edges {
          node {
            case_id
            submitter_id
            samples {
              hits {
                total
                edges {
                  node {
                    sample_type
                    tissue_type
                    tumor_descriptor
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

export const BASE_GDC_URL = 'https://portal.gdc.cancer.gov';
