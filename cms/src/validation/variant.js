import * as yup from 'yup';

import {
  variantNames,
  variantCategories,
  variantAssessmentType,
  variantExpressionLevel,
} from '../schemas/constants';

const { string, array, object } = yup;

export const modelVariantUploadSchema = object().shape({
  model_name: string().required(),
  variant: string()
    .oneOf(variantNames)
    .required(),
  assesment_type: string().oneOf(variantAssessmentType),
  expression_level: string().oneOf(variantExpressionLevel),
});

export const modelVariantSchema = object().shape({
  variant: string()
    .oneOf(variantNames)
    .required(),
  assessmentType: string().oneOf(variantAssessmentType),
  expressionLevel: string().oneOf(variantExpressionLevel),
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
