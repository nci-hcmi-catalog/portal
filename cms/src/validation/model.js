import * as yup from 'yup';
import { arrItemIsOneOf } from './helpers';
import {
  primarySites,
  clinicalTumorDiagnosis,
  clinicalTumorDiagnosisDependent,
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

const { string, number, array, object, date, boolean } = yup;

const makeClinicalTumorDiagnosisDependentSchema = (clinical_tumor_diagnosis, fieldName) =>
  string()
    .lowercase()
    .oneOf(
      (clinicalTumorDiagnosisDependent[fieldName][clinical_tumor_diagnosis] || []).map(v =>
        v.toLowerCase(),
      ),
    );

const nameValidation = /HCM-\w{4}-\d{4}.\w\d{2}/;

// In order to publish a model, this validation
// must be satisfied, including all required fields
export default object().shape({
  name: string()
    .required()
    .matches(nameValidation),
  type: string()
    .required()
    .lowercase()
    .oneOf(modelType),
  growth_rate: number()
    .required()
    .integer()
    .min(5)
    .max(90),
  split_ratio: string()
    .required()
    .oneOf(splitRatio),
  gender: string()
    .required()
    .lowercase()
    .oneOf(gender),
  race: string()
    .required()
    .nullable()
    .lowercase()
    .oneOf(race),
  age_at_diagnosis: number()
    .required()
    .integer()
    .positive(),
  age_at_sample_acquisition: number()
    .required()
    .integer()
    .positive(),
  date_of_availability: date().required(),
  primary_site: string()
    .required()
    .lowercase()
    .oneOf(primarySites),
  tnm_stage: string().matches(
    /T[0-2]N[0-4]M[0-2]/,
    'Field must follow TNM classification format: T0-T2, N0-N4, and M0-M2 ex. T0N1M2',
  ),
  neoadjuvant_therapy: string()
    .lowercase()
    .oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: boolean().nullable(),
  disease_status: string()
    .required()
    .lowercase()
    .oneOf(diseaseStatus),
  vital_status: string()
    .required()
    .lowercase()
    .oneOf(vitalStatus),
  therapy: array()
    .of(string().lowercase())
    .ensure()
    .test(
      'is-one-of',
      `Therapy can only be one of: ${therapy.join(', ')}`,
      arrItemIsOneOf(therapy),
    ),
  molecular_characterizations: array()
    .of(string().lowercase())
    .ensure()
    .test(
      'is-one-of',
      `Molecular Characterizations can only be one of: ${molecularCharacterizations.join(', ')}`,
      arrItemIsOneOf(molecularCharacterizations),
    ),
  clinical_tumor_diagnosis: string()
    .required()
    .lowercase()
    .oneOf(clinicalTumorDiagnosis),
  histological_type: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'histological type'),
  ),
  clinical_stage_grouping: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'clinical stage grouping'),
  ),
  site_of_sample_acquisition: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(
      clinical_tumor_diagnosis,
      'site of sample acquisition',
    ),
  ),
  tumor_histological_grade: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'tumor histological grade'),
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
    .matches(nameValidation),
  type: string()
    .lowercase()
    .oneOf(modelType),
  growth_rate: number(),
  split_ratio: string().oneOf(splitRatio),
  gender: string()
    .lowercase()
    .oneOf(gender),
  race: string()
    .nullable()
    .lowercase()
    .oneOf(race),
  age_at_diagnosis: number(),
  age_at_sample_acquisition: number(),
  date_of_availability: date(),
  primary_site: string()
    .lowercase()
    .oneOf(primarySites),
  tnm_stage: string(),
  neoadjuvant_therapy: string()
    .lowercase()
    .oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: boolean().nullable(),
  disease_status: string()
    .lowercase()
    .oneOf(diseaseStatus),
  vital_status: string()
    .lowercase()
    .oneOf(vitalStatus),
  therapy: array()
    .of(string().lowercase())
    .ensure()
    .test(
      'is-one-of',
      `Therapy can only be one of: ${therapy.join(', ')}`,
      arrItemIsOneOf(therapy),
    ),
  molecular_characterizations: array()
    .of(string().lowercase())
    .ensure()
    .test(
      'is-one-of',
      `Molecular Characterizations can only be one of: ${molecularCharacterizations.join(', ')}`,
      arrItemIsOneOf(molecularCharacterizations),
    ),
  clinical_tumor_diagnosis: string()
    .lowercase()
    .oneOf(clinicalTumorDiagnosis),
  histological_type: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'histological type'),
  ),
  clinical_stage_grouping: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'clinical stage grouping'),
  ),
  site_of_sample_acquisition: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(
      clinical_tumor_diagnosis,
      'site of sample acquisition',
    ),
  ),
  tumor_histological_grade: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
    makeClinicalTumorDiagnosisDependentSchema(clinical_tumor_diagnosis, 'tumor histological grade'),
  ),
  licensing_required: boolean().nullable(),
  source_model_url: string(),
  source_sequence_url: string(),
  updatedBy: string(),
  status: string(),
  variants: array()
    .of(modelVariantSchema)
    .ensure(),
});
