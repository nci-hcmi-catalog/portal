import * as yup from 'yup';
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

const { string, number, array, object, date, boolean, mixed } = yup;

const makeClinicalTumorDiagnosisDependentSchema = (clinical_tumor_diagnosis, fieldName) =>
  string()
    .lowercase()
    .oneOf(
      (clinicalTumorDiagnosisDependent[fieldName][clinical_tumor_diagnosis] || []).map(v =>
        v.toLowerCase(),
      ),
    );

const arrItemIsOneOf = options => values => {
  return values.reduce((acc, curr) => {
    if (acc === false) {
      return false;
    } else {
      return options.includes(curr);
    }
  }, true);
};

// In order to save a model, this validation must be satisfied
export default object().shape({
  model_name: string()
    .required()
    .matches(/HCM-\w{4}-\d{4}.\w\d{2}/),
  model_type: string()
    .lowercase()
    .oneOf(modelType),
  growth_rate: number()
    .integer()
    .min(5)
    .max(90),
  split_ratio: string().oneOf(splitRatio),
  gender: string()
    .lowercase()
    .oneOf(gender),
  race: string()
    .nullable()
    .lowercase()
    .oneOf(race),
  age_at_diagnosis: number()
    .integer()
    .positive(),
  age_at_sample_acquisition: number()
    .integer()
    .positive(),
  date_of_availability: date(),
  primary_site: string()
    .lowercase()
    .oneOf(primarySites),
  tnm_stage: string().matches(
    /T[0-2]N[0-4]M[0-2]/,
    'Field must follow TNM classification format: T0-T2, N0-N4, and M0-M2 ex. T0N1M2',
  ),
  neoadjuvant_therapy: string()
    .lowercase()
    .oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: boolean(),
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
  licensing_required: boolean(),
  source_model_url: string().url(),
  source_sequence_url: string().url(),
  updatedBy: string(),
  status: string(),
});

// In order to publish to ES, we need only to validate required fields since
// the create/update validation is already handled in the default export
export const publishValidation = object().shape({
  model_name: string().required(),
  model_type: string().required(),
  growth_rate: number().required(),
  split_ratio: string().required(),
  gender: string().required(),
  race: string().required(),
  age_at_diagnosis: number().required(),
  age_at_sample_acquisition: number().required(),
  date_of_availability: date().required(),
  primary_site: string().required(),
  tnm_stage: string(),
  neoadjuvant_therapy: string(),
  chemotherapeutic_drugs: boolean(),
  disease_status: string().required(),
  vital_status: string().required(),
  therapy: array(),
  molecular_characterizations: array(),
  clinical_tumor_diagnosis: string().required(),
  histological_type: string(),
  clinical_stage_grouping: string(),
  site_of_sample_acquisition: string(),
  tumor_histological_grade: string(),
  licensing_required: boolean().required(),
  source_model_url: string(),
  source_sequence_url: string(),
  updatedBy: string().required(),
  status: string().required(),
});
