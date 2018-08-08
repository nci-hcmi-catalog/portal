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
  sequenceSource,
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

export default object().shape({
  model_name: string()
    .required()
    .matches(/HCM-\w{4}-\d{4}.\w\d{2}/),
  model_type: string()
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
    .integer()
    .positive(),
  age_at_sample_acquisition: number()
    .integer()
    .positive(),
  date_of_availability: date(),
  sequence_source: mixed().oneOf(sequenceSource),
  licensing_required: boolean(),
  primary_site: string()
    .required()
    .lowercase()
    .oneOf(primarySites),
  tmn_stage: string()
    .required()
    .matches(/T[0-2]M[0-2]N[0-4]/),
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
  therapy: string()
    .lowercase()
    .oneOf(therapy),
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
  source_model_url: string().url(),
  source_sequence_url: string().url(),
  updatedBy: string(),
  status: string(),
});
