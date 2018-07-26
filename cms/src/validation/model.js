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

const makeClinicalTumorDiagnosisDependentSchema = (clinical_tumor_diagnosis, schema, fieldName) =>
  yup
    .string()
    .lowercase()
    .oneOf(
      (clinicalTumorDiagnosisDependent[fieldName][clinical_tumor_diagnosis] || []).map(v =>
        v.toLowerCase(),
      ),
    );

export default yup.object().shape({
  model_name: yup
    .string()
    .required()
    .matches(/HCM-\w{4}-\d{4}.\w\d{2}/),
  model_type: yup
    .string()
    .required()
    .lowercase()
    .oneOf(modelType),
  growth_rate: yup
    .number()
    .required()
    .integer()
    .min(5)
    .max(90),
  split_ratio: yup
    .string()
    .required()
    .oneOf(splitRatio),
  gender: yup
    .string()
    .required()
    .lowercase()
    .oneOf(gender),
  race: yup
    .string()
    .required()
    .nullable()
    .lowercase()
    .oneOf(race),
  age_at_diagnosis: yup
    .number()
    .integer()
    .positive(),
  age_at_sample_acquisition: yup
    .number()
    .integer()
    .positive(),
  date_of_availability: yup.date(),
  sequence_source: yup.mixed().oneOf(sequenceSource),
  licensing_required: yup.boolean(),
  primary_site: yup
    .string()
    .required()
    .lowercase()
    .oneOf(primarySites),
  tmn_stage: yup
    .string()
    .required()
    .matches(/T[0-2]M[0-2]N[0-4]/),
  neoadjuvant_therapy: yup
    .string()
    .lowercase()
    .oneOf(neoadjuvantTherapy),
  chemotherapeutic_drugs: yup.boolean(),
  disease_status: yup
    .string()
    .lowercase()
    .oneOf(diseaseStatus),
  vital_status: yup
    .string()
    .lowercase()
    .oneOf(vitalStatus),
  therapy: yup
    .string()
    .lowercase()
    .oneOf(therapy),
  molecular_characterizations: yup
    .string()
    .lowercase()
    .oneOf(molecularCharacterizations),
  clinical_tumor_diagnosis: yup
    .string()
    .lowercase()
    .oneOf(clinicalTumorDiagnosis),
  histological_type: yup
    .string()
    .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis, schema) =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        schema,
        'histological type',
      ),
    ),
  clinical_stage_grouping: yup
    .string()
    .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis, schema) =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        schema,
        'clinical stage grouping',
      ),
    ),
  site_of_sample_acquisition: yup
    .string()
    .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis, schema) =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        schema,
        'site of sample acquisition',
      ),
    ),
  tumor_histological_grade: yup
    .string()
    .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis, schema) =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinical_tumor_diagnosis,
        schema,
        'tumor histological grade',
      ),
    ),
});
