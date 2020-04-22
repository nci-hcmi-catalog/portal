const constants = require('./constants');
const fs = require('fs');

const makeBasicValue = value => ({ value, dependents: {} });

const makeBasic = (array, name, displayName) => ({
  name,
  displayName,
  dependentValues: [],
  values: array.map(value => makeBasicValue(value)),
});

const gatherBasicFields = () => {
  const primaryDiagnosis = makeBasic(constants.primarySites, 'primarySites', 'Primary Sites');
  const modelType = makeBasic(constants.modelType, 'modelType', 'Model Type');
  const molecularCharacterizations = makeBasic(
    constants.molecularCharacterizations,
    'molecularCharacterizations',
    'Molecular Characterizations',
  );
  const splitRatio = makeBasic(constants.splitRatio, 'splitRatio', 'Split Ratio');
  const gender = makeBasic(constants.gender, 'gender', 'Gender');
  const race = makeBasic(constants.race, 'race', 'race');
  const neoadjuvantTherapy = makeBasic(
    constants.neoadjuvantTherapy,
    'neoadjuvantTherapy',
    'Neoadjuvant Therapy',
  );
  const diseaseStatus = makeBasic(constants.diseaseStatus, 'diseaseStatus', 'Disease Status');
  const vitalStatus = makeBasic(constants.vitalStatus, 'vitalStatus', 'Vital Status');
  const therapy = makeBasic(constants.therapy, 'therapy', 'Therapy');
  const variantTypes = makeBasic(constants.variantTypes, 'variantTypes', 'Variant Types');
  const variantAssessmentType = makeBasic(
    constants.variantAssessmentType,
    'variantAssessmentType',
    'Variant Assessment Type',
  );
  const variantExpressionLevel = makeBasic(
    constants.variantExpressionLevel,
    'Variant Expression Level',
    'Variant Expression Level',
  );
  const tissueTypes = makeBasic(constants.tissueTypes, 'tissueTypes', 'Tissue Types');
  return [
    primaryDiagnosis,
    modelType,
    molecularCharacterizations,
    splitRatio,
    gender,
    race,
    neoadjuvantTherapy,
    diseaseStatus,
    vitalStatus,
    therapy,
    variantTypes,
    variantAssessmentType,
    variantExpressionLevel,
    tissueTypes,
  ];
};

// This method is lieing, there is only one Dependent Field
const gatherDepenentFields = () => {
  const ctdValues = constants.clinicalTumorDiagnosis;
  const ctdDependentValues = constants.clinicalTumorDiagnosisDependent;

  const dependentValues = Object.keys(ctdDependentValues);
  console.log(dependentValues);

  const values = ctdValues.map(value => ({
    value,
    dependents: dependentValues.reduce((acc, i) => {
      acc[i] = [];
      return acc;
    }, {}),
  }));

  dependentValues.forEach(dependentValue =>
    Object.keys(ctdDependentValues[dependentValue]).forEach(value => {
      const valueObject = values.find(i => i.value.toLowerCase() === value.toLowerCase());
      if (valueObject) {
        valueObject.dependents[dependentValue] = ctdDependentValues[dependentValue][value];
      }
    }),
  );

  const output = [
    {
      name: 'clinicalTumorDiagnosis',
      displayName: 'Clinical Tumor Diagnosis',
      dependentValues: dependentValues,
      values,
    },
  ];

  return output;
};

const run = () => {
  const basicFields = gatherBasicFields();
  const dependentField = gatherDepenentFields();

  fs.writeFileSync('./dictData.json', JSON.stringify([...basicFields, ...dependentField]));
};

run();
