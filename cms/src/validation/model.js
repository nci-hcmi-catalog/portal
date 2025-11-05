import * as yup from 'yup';
import {
  arrItemIsOneOf,
  nameRegex,
  nameRegexError,
  numberEmptyValueTransform,
  makeClinicalTumorDiagnosisDependentSchema,
  momentDateParser,
} from './helpers.js';

import { modelVariantSchema } from './variant.js';
import getPublishSchema from './getPublishSchema.js';
import { getDictionaryOptions } from '../helpers/dictionary.js';

yup.date().transform(momentDateParser);

const { string, number, array, object, date, boolean } = yup;

// In order to save to ES, we do a minimal validation,
// enforcing only the minimal set of conditions
export const getSaveValidation = async () => {
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
  } = await getDictionaryOptions();

  return object().shape({
    name: string().required('This is a required field').matches(nameRegex, nameRegexError),
    type: string().oneOf(modelTypeOptions),
    expanded: boolean(),
    growth_rate: number().integer().transform(numberEmptyValueTransform).nullable(true),
    split_ratio: string().oneOf(splitRatioOptions).nullable(true),
    time_to_split: string().nullable(true),
    gender: string().oneOf(genderOptions),
    race: string().nullable(true).oneOf(raceOptions),
    age_at_diagnosis: number().transform(numberEmptyValueTransform).nullable(true),
    age_at_sample_acquisition: number().transform(numberEmptyValueTransform).nullable(true),
    date_of_availability: date().nullable(true),
    primary_site: string().oneOf(primarySitesOptions),
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
    clinical_tumor_diagnosis: string()
      .nullable(true)
      .notRequired()
      .oneOf(clinicalTumorDiagnosisOptions),
    tissue_type: string().oneOf(tissueTypesOptions).nullable(true),
    histological_type: string().when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinicalTumorDiagnosisDependent,
        clinical_tumor_diagnosis,
        'histological type',
      ),
    ),
    clinical_stage_grouping: string()
      .nullable(true)
      .notRequired()
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'clinical stage grouping',
        ),
      ),
    site_of_sample_acquisition: string()
      .nullable(true)
      .notRequired()
      .when('clinical_tumor_diagnosis', (clinical_tumor_diagnosis) =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'site of sample acquisition',
        ),
      ),
    tumor_histological_grade: string()
      .nullable(true)
      .notRequired()
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
  });
};

const model = async () => {
  const dictionaryOptions = await getDictionaryOptions();
  return await getPublishSchema([], dictionaryOptions);
};

export default model;
