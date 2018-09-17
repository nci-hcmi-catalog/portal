export const isFormReadyToSave = (dirty, errors) => dirty && !('name' in errors);

export const isFormReadyToPublish = (values, dirty, errors) =>
  (values.status !== 'published' || dirty) && Object.keys(errors).length === 0;
