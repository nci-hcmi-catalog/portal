import { fetchData } from '../services/Fetcher';
import config from '../config';

export const getDictionary = async () => {
  const url = `${config.urls.cmsBase}/dictionary`;
  const response = await fetchData({ url, method: 'get', data: '' });
  const dictionary = response.data;
  return dictionary;
};

export const getDictionaryDraft = async () => {
  const url = `${config.urls.cmsBase}/dictionary/draft`;
  const response = await fetchData({ url, method: 'get', data: '' });
  const dictionary = response.data;
  return dictionary;
};

export const CLINICAL_TUMOR_DIAGNOSIS = 'Clinical Tumor Diagnosis';

export const DEPENDENT_FIELD_KEYS = {
  histologicalType: 'histological type',
  clinicalStageGrouping: 'clinical stage grouping',
  siteOfSampleAcquisition: 'site of sample acquisition',
  tumorHistologicalGrade: 'tumor histological grade',
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
