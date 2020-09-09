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

export { imgPath, VARIANT_TYPES, VARIANT_IMPORT_STATUS };
