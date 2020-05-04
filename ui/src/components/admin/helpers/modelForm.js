// import {getDictionary} from '../dictionary';
export const isFormReadyToSave = (dirty, errors) => dirty && !('name' in errors);

export const isFormReadyToPublish = (values, dirty, errors) =>
  (values.status !== 'published' || dirty) && Object.keys(errors).length === 0;

// export const fetchModelValidator = async (excludeModels) => {
//   const dictionary = await getDictionary();

// }
