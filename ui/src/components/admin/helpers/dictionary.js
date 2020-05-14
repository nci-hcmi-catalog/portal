import { get, fetchData, patch, post } from '../services/Fetcher';
import config from '../config';

const DICTIONARY_URL = `${config.urls.cmsBase}/dictionary`;
const DICTIONARY_DRAFT_URL = `${DICTIONARY_URL}/draft`;

export const getDictionary = async () => {
  const url = DICTIONARY_URL;
  const response = await get({ url });
  const dictionary = response.data;
  return dictionary;
};

export const getDictionaryDraft = async () => {
  const url = DICTIONARY_DRAFT_URL;
  const response = await get({ url });
  const dictionary = response.data;
  return dictionary;
};

export const deleteDictionaryDraft = async () => {
  const url = DICTIONARY_DRAFT_URL;
  const response = await fetchData({ url, method: 'delete', data: '' });
  const dictionary = response.data;
  return dictionary;
};

export const publishDictionaryDraft = async () => {
  const url = `${DICTIONARY_DRAFT_URL}/publish`;
  const response = await post({ url, data: '' });
  const dictionary = response.data;
  return dictionary;
};

export const addDictionaryDraftValue = async ({
  field = '',
  parent = '',
  dependentName = '',
  value = '',
}) => {
  const url = DICTIONARY_DRAFT_URL;
  const data = {
    field,
    parent,
    dependentName,
    value,
  };
  const response = await post({ url, data });
  // TODO: error handling from API
  const dictionary = response.data;
  return dictionary;
};

export const editDictionaryDraftValue = async ({
  field = '',
  parent = '',
  dependentName = '',
  original = '',
  updated = '',
}) => {
  const url = DICTIONARY_DRAFT_URL;
  const data = {
    field,
    parent,
    dependentName,
    original,
    updated,
  };
  const response = await patch({ url, data });
  // TODO: error handling from API
  const dictionary = response.data;
  return dictionary;
};

export const removeDictionaryDraftValue = async ({
  field = '',
  parent = '',
  dependentName = '',
  value = '',
}) => {
  const url = `${DICTIONARY_DRAFT_URL}/remove`;
  const data = {
    field,
    parent,
    dependentName,
    value,
  };
  const response = await post({ url, data });
  // TODO: error handling from API
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
