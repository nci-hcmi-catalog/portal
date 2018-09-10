import * as yup from 'yup';

import { variantTypes, variantAssessmentType, variantExpressionLevel } from '../schemas/constants';

const { string, array, object } = yup;

export const modelVariantUploadSchema = object().shape({
  model_name: string().required(),
  variant_name: string().required(),
  variant_type: string()
    .oneOf(variantTypes)
    .required(),
  assesment_type: string().oneOf(variantAssessmentType),
  expression_level: string().oneOf(variantExpressionLevel),
});

export const modelVariantSchema = object().shape({
  variant: string().required(),
  assesment_type: string().oneOf(variantAssessmentType),
  expression_level: string().oneOf(variantExpressionLevel),
});

export default object().shape({
  name: string().required(),
  type: string().required(),
  category: string()
    .oneOf(variantTypes)
    .required(),
  genes: array().required(),
});
