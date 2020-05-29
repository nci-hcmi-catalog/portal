import { google } from 'googleapis';

import { getDictionary } from '../helpers/dictionary';

const columnHeaders = [
  'Name',
  'Type',
  'Expanded',
  'Growth Rate',
  'Split Ratio',
  'Time to Split',
  'Gender',
  'Race',
  'Age at Diagnosis',
  'Age at Sample Acquisition',
  'Date of Availability',
  'Distributor Part Number',
  'Source Model URL',
  'Source Sequence URL',
  'Primary Site',
  'TNM Stage',
  'Neoadjuvant Therapy',
  'Chemotherapeutic Drugs',
  'Disease Status',
  'Vital Status',
  'Therapy',
  'Molecular Characterizations',
  'Tissue Type',
  'Clinical Tumor Diagnosis',
  'Histological Type',
  'Clinical Stage Grouping',
  'Site of Sample Acquisition',
  'Tumor Histological Grade',
  'Histopathological Biomarkers',
  'Licensing Required',
  'Matched Model',
];
const firstRowData = {
  values: columnHeaders.map(header => ({ userEnteredValue: { stringValue: header } })),
};

// These should match the field names and the order of columnHeaders
// If it starts with an _ that means it is a placeholder and is not going to be found in the dictionary
const enumNames = [
  '',
  'modelType',
  'expanded',
  '_growthrate',
  'splitRatio',
  '_timetosplit',
  'gender',
  'race',
  '_ageatdiagnosis',
  '_ageatsample',
  '_dateavailable',
  '_sourcemodel',
  '_sourcesequence',
  '_distributorpartnumber',
  'primarySites',
  '_tnmStage',
  'neoadjuvantTherapy',
  'chemotherapeuticDrugs',
  'diseaseStatus',
  'vitalStatus',
  'therapy',
  'molecularCharacterizations',
  'tissueTypes',
  'clinicalTumorDiagnosis',
  '_histologicalSubtype',
  '_clinicalstage',
  '_siteofsample',
  '_tumorhistologicalgrade',
  'licensingRequired',
  '_matchedmodel',
];
const nonDictionaryFields = [
  { name: 'chemotherapeuticDrugs', values: [{ value: 'Yes' }, { value: 'No' }] },
  { name: 'licensingRequired', values: [{ value: 'Yes' }, { value: 'No' }] },
  { name: 'expanded', values: [{ value: 'TRUE' }, { value: 'FALSE' }] },
];

export const createModelUploadTemplate = async authClient => {
  const dictionary = await getDictionary();
  const allDictionaryFields = [...dictionary.fields, ...nonDictionaryFields];

  const sheets = google.sheets({ version: 'v4', auth: authClient });

  // Date formatted like: May-29-2020-13:51:42
  const dateStamp = Date()
    .split(' ')
    .splice(1, 4)
    .join('-');

  const spreadsheet = {
    resource: {
      properties: { title: `${dateStamp} HCMI Bulk Upload Models Template` },
      sheets: [
        {
          properties: { title: 'Models', index: 0 },
          data: {
            rowData: [firstRowData],
          },
        },
      ],
    },
  };

  const response = await new Promise((resolve, reject) => {
    sheets.spreadsheets.create(spreadsheet, (err, data) => {
      if (err) {
        console.log('Error occured creating google sheet for models bulk upload template.');
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const { spreadsheetId, spreadsheetUrl } = response.data;
  const modelSheet = response.data.sheets.find(sheet => sheet.properties.title === 'Models');

  // Add request for list validation for fields that have enum from data dictionary:
  const buildValidationRequest = (name, columnIndex) => ({
    setDataValidation: {
      range: {
        sheetId: modelSheet.properties.sheetId,
        startRowIndex: 1,
        startColumnIndex: columnIndex,
        endColumnIndex: parseInt(columnIndex) + 1,
      },
      rule: {
        condition: {
          type: 'ONE_OF_LIST',
          values: allDictionaryFields
            .find(field => field.name === name)
            .values.map(value => ({ userEnteredValue: value.value })),
        },
        strict: 'true',
        showCustomUi: 'true',
      },
    },
  });
  const requests = [];

  for (const i in enumNames) {
    const name = enumNames[i];

    if (allDictionaryFields.find(field => field.name === name)) {
      const request = buildValidationRequest(name, i);
      requests.push(request);
    }
  }

  const dataValidationRequest = {
    spreadsheetId,
    resource: {
      requests,
    },
  };
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.batchUpdate(dataValidationRequest, (err, data) => {
      if (err) {
        console.log(
          'Error occured updating google sheet models bulk upload template with data validations.',
        );
        reject(err);
      } else {
        resolve({ spreadsheetUrl });
      }
    });
  });
};
