import * as yup from 'yup';

import { tissueTypes } from '../schemas/constants';

const { string, array, object } = yup;

export const matchedModelSchema = object().shape({
  name: string().required(),
  tissue_type: string().oneOf(tissueTypes),
});
