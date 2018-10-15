import * as yup from 'yup';
import moment from 'moment';
import { arrItemIsOneOf } from './helpers';

import {
  clinicalTumorDiagnosisDependent,
  primarySites,
  clinicalTumorDiagnosis,
  modelType,
  molecularCharacterizations,
  splitRatio,
  gender,
  race,
  neoadjuvantTherapy,
  diseaseStatus,
  vitalStatus,
  therapy,
} from '../schemas/constants';

import { modelVariantSchema } from './variant';

// Custom date validation parser
yup.date().transform(function(value, originalValue) {
  if (this.isType(value)) return value;
  //the default coercion transform failed so lets try it with Moment instead
  value = moment(originalValue);
  return value.isValid() ? value.toDate() : new Date('');
});

const { string, number, array, object, date, boolean } = yup;

const makeClinicalTumorDiagnosisDependentSchema = (clinical_tumor_diagnosis = '', fieldName = '') =>
  string()
    .nullable(true)
    .oneOf(
      (
        clinicalTumorDiagnosisDependent[fieldName.toLowerCase()][
          clinical_tumor_diagnosis.toLowerCase()
        ] || []
      ).concat([null, '']), // allow null values (to be removed by Mongoose schema set)
    );

const nameValidation = /HCM-\w{4}-\d{4}\.\w\d{2}$/;

// In order to publish a model, this validation
// must be satisfied, including all required fields
export default object().shape({
  name: string()
    .required()
    .matches(
      nameValidation,
      'Name should follow the format HCM-[4-letter Center code]-[4 number model code].[ICD10]',
    ),
  type: string()
    .required()

    .oneOf(modelType),
  growth_rate: number()
    .required()
    .integer()
    .min(1)
    .max(99),
  split_ratio: string()
    .required()
    .oneOf(splitRatio),
  gender: string()
    .required()

    .oneOf(gender),
  race: string()
    .required()
    .nullable(true)
    .oneOf(race),
  age_at_diagnosis: number()
    .required()
    .integer()
    .min(0)
    .max(99),
  age_at_sample_acquisition: number()
    .required()
    .integer()
    .min(0)
    .max(99),
  date_of_availability: date().required(),
  primary_site: string()
    .required()
    .oneOf(primarySites),
  tnm_stage: string().matches(
    /T[0-5]N[0-4]M[0-2]/,
    'Field must follow TNM classification format: T0-T5, N0-N4, and M0-M2 ex. T0N1M2',
  ),
  neoadjuvant_therapy: string().oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: boolean().nullable(true),
  disease_status: string()
    .required()

    .oneOf(diseaseStatus),
  vital_status: string()
    .required()

    .oneOf(vitalStatus),
  therapy: array()
    .of(string())
    .ensure()
    .test(
      'is-one-of',
      `Therapy can only be one of: ${therapy.join(', ')}`,
      arrItemIsOneOf(therapy),
    ),
  molecular_characterizations: array()
    .of(string())
    .ensure()
    .test(
      'is-one-of',
      `Molecular Characterizations can only be one of: ${molecularCharacterizations.join(', ')}`,
      arrItemIsOneOf(molecularCharacterizations),
    ),
  clinical_tumor_diagnosis: string()
    .required()
    .oneOf(clinicalTumorDiagnosis),
  histological_type: string()
    .nullable(true)
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'histological type'),
    ),
  clinical_stage_grouping: string()
    .nullable(true)
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'clinical stage grouping',
      ),
    ),
  site_of_sample_acquisition: string()
    .nullable(true)
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'site of sample acquisition',
      ),
    ),
  tumor_histological_grade: string()
    .nullable(true)
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'tumor histological grade',
      ),
    ),
  licensing_required: boolean().required(),
  source_model_url: string().url(),
  source_sequence_url: string().url(),
  updatedBy: string(),
  status: string(),
  variants: array()
    .of(modelVariantSchema)
    .ensure(),
});

// In order to save to ES, we do a minimal validation,
// enforcing only the minimal set of conditions
export const saveValidation = object().shape({
  name: string()
    .required()
    .matches(
      nameValidation,
      'Name should follow the format HCM-[4-letter Center code]-[4 number model code].[ICD10]',
    ),
  type: string().oneOf(modelType),
  growth_rate: number(),
  split_ratio: string().oneOf(splitRatio),
  gender: string().oneOf(gender),
  race: string()
    .nullable(true)
    .oneOf(race),
  age_at_diagnosis: number(),
  age_at_sample_acquisition: number(),
  date_of_availability: date(),
  primary_site: string().oneOf(primarySites),
  tnm_stage: string(),
  neoadjuvant_therapy: string().oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: boolean().nullable(true),
  disease_status: string().oneOf(diseaseStatus),
  vital_status: string().oneOf(vitalStatus),
  therapy: array()
    .of(string())
    .ensure()
    .test(
      'is-one-of',
      `Therapy can only be one of: ${therapy.join(', ')}`,
      arrItemIsOneOf(therapy),
    ),
  molecular_characterizations: array()
    .of(string())
    .ensure()
    .test(
      'is-one-of',
      `Molecular Characterizations can only be one of: ${molecularCharacterizations.join(', ')}`,
      arrItemIsOneOf(molecularCharacterizations),
    ),
  clinical_tumor_diagnosis: string()
    .nullable(true)
    .notRequired()
    .oneOf(clinicalTumorDiagnosis),
  histological_type: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'histological type'),
  ),
  clinical_stage_grouping: string()
    .nullable(true)
    .notRequired()
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'clinical stage grouping',
      ),
    ),
  site_of_sample_acquisition: string()
    .nullable(true)
    .notRequired()
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'site of sample acquisition',
      ),
    ),
  tumor_histological_grade: string()
    .nullable(true)
    .notRequired()
    .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        'tumor histological grade',
      ),
    ),
  licensing_required: boolean().nullable(true),
  source_model_url: string(),
  source_sequence_url: string(),
  updatedBy: string(),
  status: string(),
  variants: array()
    .of(modelVariantSchema)
    .ensure(),
});
