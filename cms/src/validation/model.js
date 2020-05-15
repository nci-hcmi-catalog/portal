import * as yup from 'yup';
import moment from 'moment';
import { arrItemIsOneOf } from './helpers';

import { modelVariantSchema } from './variant';
import { matchedModelSchema } from './matchedModels';
import { getDictionaryOptions } from '../helpers/dictionary';

// Custom date validation parser
yup.date().transform(function(value, originalValue) {
  if (this.isType(value)) return value;
  //the default coercion transform failed so lets try it with Moment instead
  value = moment(originalValue);
  return value.isValid() ? value.toDate() : new Date('');
});

const { string, number, array, object, date, boolean } = yup;

// Custom number transform to handle empty values
// TODO: setting a global yup.number().transform() didn't solve the problem
// using transforms is not ideal as this causes a value change -
// the solution is to create custom classes potentially derived from
// yup.mixed to handle all possible values - but for now using transform in favor of time
// related issue: https://github.com/jquense/yup/issues/298
const numberEmptyValueTransform = value => (value === '' || isNaN(value) ? undefined : value);

const makeClinicalTumorDiagnosisDependentSchema = (
  clinicalTumorDiagnosisDependent,
  clinical_tumor_diagnosis = '',
  fieldName = '',
) =>
  string()
    .nullable(true)
    .oneOf(
      (
        clinicalTumorDiagnosisDependent[fieldName.toLowerCase()][
          clinical_tumor_diagnosis.toLowerCase()
        ] || []
      ).concat([null, '']), // allow null values (to be removed by Mongoose schema set)
    );

const nameRegex = /^HCM-[A-Z]{4}-\d{4}-[A-Z]\d{2}(-[A-Z])?$/;
const nameRegexError =
  'Name should follow the format HCM-[4-letter Center code]-[4 number model code]-[ICD10]-[1 optional multiple indicator letter]';
//const tnmValidation = /T[0-5]N[0-4]M[0-2]/;

export const getPublishSchema = async (excludedNames, dictionary) => {
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
    expanded: boolean(), // TODO: add required when expanded is released: .required('This is a required field'),
    type: string().oneOf(modelTypeOptions),
    growth_rate: number()
      .integer()
      .transform(numberEmptyValueTransform)
      .min(1)
      .max(99),
    split_ratio: string().oneOf(splitRatioOptions),
    time_to_split: string(),
    gender: string()
      .required('This is a required field')
      .oneOf(genderOptions),
    race: string()
      .required('This is a required field')
      .nullable(true)
      .oneOf(raceOptions),
    age_at_diagnosis: number()
      .integer()
      .transform(numberEmptyValueTransform)
      .min(0)
      .max(99),
    age_at_sample_acquisition: number()
      .integer()
      .transform(numberEmptyValueTransform)
      .min(0)
      .max(99),
    date_of_availability: date(),
    primary_site: string()
      .required('This is a required field')
      .oneOf(primarySitesOptions, 'Invalid entry for Primary Site'),
    tnm_stage: string(),
    neoadjuvant_therapy: string().oneOf(neoadjuvantTherapyOptions),
    chemotherapeutic_drugs: boolean().nullable(true),
    disease_status: string().oneOf(diseaseStatusOptions),
    vital_status: string().oneOf(vitalStatusOptions),
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
    tissue_type: string().oneOf(tissueTypesOptions),
    clinical_tumor_diagnosis: string()
      .required('This is a required field')
      .oneOf(clinicalTumorDiagnosisOptions),
    histological_type: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'histological type',
        ),
      ),
    clinical_stage_grouping: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'clinical stage grouping',
        ),
      ),
    site_of_sample_acquisition: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'site of sample acquisition',
        ),
      ),
    tumor_histological_grade: string()
      .nullable(true)
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'tumor histological grade',
        ),
      ),
    licensing_required: boolean(),
    distributor_part_number: string(),
    source_model_url: string().url(),
    source_sequence_url: string().url(),
    somatic_maf_url: string().url(),
    updatedBy: string(),
    status: string(),
    variants: array()
      .of(modelVariantSchema)
      .ensure(),
    matched_models: array()
      .of(matchedModelSchema)
      .ensure(),
  });
};

export default async () => {
  const dictionary = await getDictionaryOptions();
  return await getPublishSchema([], dictionary);
};

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
    name: string()
      .required('This is a required field')
      .matches(nameRegex, nameRegexError),
    type: string().oneOf(modelTypeOptions),
    expanded: boolean(),
    growth_rate: number()
      .integer()
      .transform(numberEmptyValueTransform),
    split_ratio: string().oneOf(splitRatioOptions),
    time_to_split: string(),
    gender: string().oneOf(genderOptions),
    race: string()
      .nullable(true)
      .oneOf(raceOptions),
    age_at_diagnosis: number().transform(numberEmptyValueTransform),
    age_at_sample_acquisition: number().transform(numberEmptyValueTransform),
    date_of_availability: date(),
    primary_site: string().oneOf(primarySitesOptions),
    tnm_stage: string(),
    neoadjuvant_therapy: string().oneOf(neoadjuvantTherapyOptions),
    chemotherapeutic_drugs: boolean().nullable(true),
    disease_status: string().oneOf(diseaseStatusOptions),
    vital_status: string().oneOf(vitalStatusOptions),
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
    tissue_type: string().oneOf(tissueTypesOptions),
    histological_type: string().when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
      makeClinicalTumorDiagnosisDependentSchema(
        clinicalTumorDiagnosisDependent,
        clinical_tumor_diagnosis,
        'histological type',
      ),
    ),
    clinical_stage_grouping: string()
      .nullable(true)
      .notRequired()
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'clinical stage grouping',
        ),
      ),
    site_of_sample_acquisition: string()
      .nullable(true)
      .notRequired()
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'site of sample acquisition',
        ),
      ),
    tumor_histological_grade: string()
      .nullable(true)
      .notRequired()
      .when('clinical_tumor_diagnosis', clinical_tumor_diagnosis =>
        makeClinicalTumorDiagnosisDependentSchema(
          clinicalTumorDiagnosisDependent,
          clinical_tumor_diagnosis,
          'tumor histological grade',
        ),
      ),
    licensing_required: boolean().nullable(true),
    distributor_part_number: string(),
    source_model_url: string(),
    source_sequence_url: string(),
    somatic_maf_url: string().url(),
    updatedBy: string(),
    status: string(),
    variants: array()
      .of(modelVariantSchema)
      .ensure(),
  });
};
