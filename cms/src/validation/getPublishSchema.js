import * as yup from 'yup';
import moment from 'moment';
import {
  arrItemIsOneOf,
  nameRegex,
  nameRegexError,
  numberEmptyValueTransform,
  makeClinicalTumorDiagnosisDependentSchema,
  momentDateParser,
} from './helpers.js';

import { modelVariantSchema } from './variant.js';
import { matchedModelSchema } from './matchedModels.js';

yup.date().transform(momentDateParser);

const { string, number, array, object, date, boolean } = yup;

// This validator is also used in the browser and should not include imports of references to Mongoose
const getPublishSchema = async (excludedNames, dictionary) => {
  const {
    clinicalTumorDiagnosisDependent,
    clinicalTumorDiagnosisOptions,
    primarySitesOptions,
    modelTypeOptions,
    molecularCharacterizationsOptions,
    splitRatioOptions,
    genderOptions,
    raceOptions,
    neoadjuvantTherapyOptions,
    diseaseStatusOptions,
    vitalStatusOptions,
    therapyOptions,
    tissueTypesOptions,
  } = dictionary;
  return object().shape({
    name: string()
      .required('This is a required field')
      .matches(nameRegex, nameRegexError)
      .notOneOf(excludedNames, 'This model already exists'),
    expanded: boolean().required('This is a required field'),
    type: string().oneOf(modelTypeOptions),
    growth_rate: number().integer().transform(numberEmptyValueTransform).min(1).max(99),
    split_ratio: string().oneOf(splitRatioOptions).nullable(true),
    time_to_split: string().nullable(true),
    gender: string().required('This is a required field').oneOf(genderOptions),
    race: string().required('This is a required field').nullable(true).oneOf(raceOptions),
    age_at_diagnosis: number().integer().transform(numberEmptyValueTransform).min(0).max(99),
    age_at_sample_acquisition: number()
      .integer()
      .transform(numberEmptyValueTransform)
      .min(0)
      .max(99),
    date_of_availability: date().nullable(true),
    primary_site: string()
      .required('This is a required field')
      .oneOf(primarySitesOptions, 'Invalid entry for Primary Site'),
    tnm_stage: string().nullable(true),
    neoadjuvant_therapy: string().oneOf(neoadjuvantTherapyOptions).nullable(true),
    chemotherapeutic_drugs: boolean().nullable(true),
    disease_status: string().oneOf(diseaseStatusOptions).nullable(true),
    vital_status: string().oneOf(vitalStatusOptions).nullable(true),
    therapy: array()
      .of(string())
      .ensure()
      .test(
        'is-one-of',
        `Therapy can only be one of: ${therapyOptions.join(', ')}`,
        arrItemIsOneOf(therapyOptions),
      ),
    molecular_characterizations: array()
      .of(string())
      .ensure()
      .test(
        'is-one-of',
        `Molecular Characterizations can only be one of: ${molecularCharacterizationsOptions.join(
          ', ',
        )}`,
        arrItemIsOneOf(molecularCharacterizationsOptions),
      ),
    tissue_type: string().oneOf(tissueTypesOptions).nullable(true),
    clinical_tumor_diagnosis: string()
      .required('This is a required field')
      .oneOf(clinicalTumorDiagnosisOptions),
    histological_type: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'histological type',
        ),
      ),
    clinical_stage_grouping: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'clinical stage grouping',
        ),
      ),
    site_of_sample_acquisition: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'site of sample acquisition',
        ),
      ),
    tumor_histological_grade: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'tumor histological grade',
        ),
      ),
    licensing_required: boolean().nullable(true),
    distributor_part_number: string().nullable(true),
    source_model_url: string().url().nullable(true),
    source_sequence_url: string().url().nullable(true),
    somatic_maf_url: string().url().nullable(true),
    proteomics_url: string().url().nullable(true),
    updatedBy: string(),
    status: string(),
    variants: array().of(modelVariantSchema).ensure(),
    matched_models: array().of(matchedModelSchema).ensure(),
  });
};

export default getPublishSchema;
