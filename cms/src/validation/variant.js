import * as yup from 'yup';

import {
  variantNames,
  variantCategories,
  variantAssessmentType,
  variantExpressionLevel,
} from '../schemas/constants';

const { string, array, object } = yup;

export const modelVariantSchema = object().shape({
  name: string()
    .oneOf(variantNames)
    .required(),
  assessmentType: string()
    .oneOf(variantAssessmentType)
    .required(),
  expressionLevel: string()
    .oneOf(variantExpressionLevel)
    .required(),
});

export default object().shape({
  _id: string()
    .oneOf(variantNames)
    .required(),
  type: string().required(),
  category: string()
    .oneOf(variantCategories)
    .required(),
  genes: array().required(),
});
