import { fetchData } from '../services/Fetcher';
import config from '../config';

export const getDictionary = async () => {
  const url = `${config.urls.cmsBase}/dictionary`;
  const response = await fetchData({ url, method: 'get', data: '' });
  const dictionary = response.data;

  const output = dictionary.reduce((acc, field) => {
    let { name, values } = field;
    acc[`${name}Options`] = values.map(i => i.value);
    return acc;
  }, {});
  const ctd = dictionary.find(i => i.name === 'clinicalTumorDiagnosis');

  const ctdDependentOptions = {};

  ctd.dependentValues.forEach(val => (ctdDependentOptions[val] = {}));

  ctd.values.forEach(val => {
    const valueName = val.value;
    for (const dependentName in val.dependents) {
      const dependentValues = val.dependents[dependentName];
      ctdDependentOptions[dependentName][valueName.toLowerCase()] = dependentValues;
    }
  });
  output.clinicalTumorDiagnosisDependent = ctdDependentOptions;

  return output;
};

export const emptyDictionary = {
  clinicalTumorDiagnosisDependent: {},
  clinicalTumorDiagnosisOptions: [],
  modelTypeOptions: [],
  molecularCharacterizationsOptions: [],
  splitRatioOptions: [],
  genderOptions: [],
  raceOptions: [],
  neoadjuvantTherapyOptions: [],
  diseaseStatusOptions: [],
  vitalStatusOptions: [],
  therapyOptions: [],
  primarySitesOptions: [],
  tissueTypeOptions: [],
};
