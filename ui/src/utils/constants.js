const BULK_NONACTIONABLE_ERROR_ID = 'BULK_NONACTIONABLE_IMPORT_ERRORS';

const BULK_UPLOAD_TYPES = {
  MODEL: 'model',
  VARIANT: 'variant',
};

const BULK_UPLOAD_DISPLAY_TYPES = {
  MODEL: 'model',
  VARIANT: 'clinical variant',
};

const GDC_CASE_URL_BASE = 'https://portal.gdc.cancer.gov/cases';
const GDC_FILE_PAGE_URL_BASE = 'https://portal.gdc.cancer.gov/files';

const GDC_CANCER_MODEL_SAMPLE_TYPES = [
  'Expanded Next Generation Cancer Model',
  'Next Generation Cancer Model',
];

const GDC_MODEL_STATES = {
  modelNotFound: 'MODEL_NOT_FOUND',
  noMafs: 'NO_MAFS',
  singleNgcm: 'SINGLE_NGCM',
  singleNgcmPlusEngcm: 'SINGLE_NGCM_PLUS_ENGCM',
  multipleNgcm: 'MULTIPLE_NGCM',
  noNgcm: 'NO_NGCM',
};

const GENOMIC_VARIANTS_IMPORT_ERRORS = {
  noMatchingModel: 'NO_MATCHING_MODEL',
  badRequest: 'BAD_REQUEST',
  gdcCommunicationError: 'GDC_COMMUNICATION_ERROR',
  unexpected: 'UNEXPECTED',
};

const imgPath = '/api/data/images';

const VARIANT_IMPORT_TYPES = {
  bulk: 'BULK',
  individual: 'INDIVIDUAL',
};

const VARIANT_TYPES = {
  clinical: 'clinical',
  histopathological: 'histopathological biomarker',
  genomic: 'genomic_sequencing',
};

const VARIANT_IMPORT_STATUS = {
  active: 'ACTIVE',
  complete: 'COMPLETE',
  error: 'ERROR',
  stopped: 'STOPPED',
  waiting: 'WAITING',
};

const VARIANT_OVERWRITE_OPTIONS = {
  cleanOnly: 'CLEAN_ONLY',
  allModels: 'ALL_MODELS',
  none: 'NONE',
};

export {
  BULK_NONACTIONABLE_ERROR_ID,
  BULK_UPLOAD_DISPLAY_TYPES,
  BULK_UPLOAD_TYPES,
  GDC_CASE_URL_BASE,
  GDC_FILE_PAGE_URL_BASE,
  GDC_CANCER_MODEL_SAMPLE_TYPES,
  GDC_MODEL_STATES,
  GENOMIC_VARIANTS_IMPORT_ERRORS,
  imgPath,
  VARIANT_IMPORT_TYPES,
  VARIANT_IMPORT_STATUS,
  VARIANT_OVERWRITE_OPTIONS,
  VARIANT_TYPES,
};
