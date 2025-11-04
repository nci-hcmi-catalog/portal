import { string } from 'yup';

export const arrItemIsOneOf = (options) => (values) => {
  return values.reduce((acc, curr) => {
    if (acc === false) {
      return false;
    } else {
      return options.includes(curr);
    }
  }, true);
};

// Custom number transform to handle empty values
// TODO: setting a global yup.number().transform() didn't solve the problem
// using transforms is not ideal as this causes a value change -
// the solution is to create custom classes potentially derived from
// yup.mixed to handle all possible values - but for now using transform in favor of time
// related issue: https://github.com/jquense/yup/issues/298
export const numberEmptyValueTransform = (value) =>
  value === '' || isNaN(value) ? undefined : value;

export const nameRegex = /^HCM-[A-Z]{4}-\d{4}-[A-Z]\d{2}(-[A-Z])?$/;
export const nameRegexError =
  'Name should follow the format HCM-[4-letter Center code]-[4 number model code]-[ICD10]-[1 optional multiple indicator letter]';

export const makeClinicalTumorDiagnosisDependentSchema = (
  clinicalTumorDiagnosisDependent,
  clinical_tumor_diagnosis = '',
  fieldName = '',
) =>
  string()
    .nullable(true)
    .oneOf(
      (
        clinicalTumorDiagnosisDependent[String(fieldName).toLowerCase()][
          String(clinical_tumor_diagnosis).toLowerCase()
        ] || []
      ).concat([null, '']), // allow null values (to be removed by Mongoose schema set)
    );
