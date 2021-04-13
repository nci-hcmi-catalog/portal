const BULK_UPLOAD_TYPES = {
  MODEL: 'model',
  VARIANT: 'variant',
};

const BULK_UPLOAD_DISPLAY_TYPES = {
  MODEL: 'model',
  VARIANT: 'clinical variant',
};

const imgPath = '/api/data/images';

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
};

const VARIANT_OVERWRITE_OPTIONS = {
  cleanOnly: 'CLEAN_ONLY',
  allModels: 'ALL_MODELS',
  none: 'NONE',
};

export {
  BULK_UPLOAD_DISPLAY_TYPES,
  BULK_UPLOAD_TYPES,
  imgPath,
  VARIANT_IMPORT_STATUS,
  VARIANT_OVERWRITE_OPTIONS,
  VARIANT_TYPES,
};
