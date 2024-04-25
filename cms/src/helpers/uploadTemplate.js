import { google } from 'googleapis';

import { getDictionary } from '../helpers/dictionary';

import { variantTypes, variantAssessmentType, variantExpressionLevel } from '../schemas/constants';
import Variant from '../schemas/variant';

import getLogger from '../logger';
const logger = getLogger('helpers/uploadTemplate');

const headerRowData = headerNames => ({
  values: headerNames.map(header => ({ userEnteredValue: { stringValue: header } })),
});

export const createModelUploadTemplate = async authClient => {
  const modelColumnHeaders = [
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
    'Somatic MAF URL',
    'Proteomics URL',
  ];
  // These should match the field names and the order of columnHeaders
  // If it starts with an _ that means it is a placeholder and is not going to be found in the dictionary
  const modelEnumNames = [
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
    'somatic_maf_url',
    'proteomics_url',
  ];
  const nonDictionaryModelFields = [
    { name: 'chemotherapeuticDrugs', values: [{ value: 'Yes' }, { value: 'No' }] },
    { name: 'licensingRequired', values: [{ value: 'Yes' }, { value: 'No' }] },
    { name: 'expanded', values: [{ value: 'TRUE' }, { value: 'FALSE' }] },
  ];

  const dictionary = await getDictionary();
  const allDictionaryFields = [...dictionary.fields, ...nonDictionaryModelFields];

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
            rowData: [headerRowData(modelColumnHeaders)],
          },
        },
      ],
    },
  };

  const response = await new Promise((resolve, reject) => {
    sheets.spreadsheets.create(spreadsheet, (err, data) => {
      if (err) {
        logger.error('Error occured creating google sheet for models bulk upload template.');
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

  for (const i in modelEnumNames) {
    const name = modelEnumNames[i];

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
        logger.error(
          'Error occured updating google sheet models bulk upload template with data validations.',
        );
        reject(err);
      } else {
        resolve({ spreadsheetUrl });
      }
    });
  });
};

export const createVariantUploadTemplate = async authClient => {
  const variantColumnHeaders = [
    'Model Name',
    'Variant Name',
    'Variant Type',
    'Assessment Type',
    'Expression Level',
  ];

  const variantData = await Variant.find({});
  const variantNames = variantData.map(variant => variant.name);

  const sheets = google.sheets({ version: 'v4', auth: authClient });

  // Date formatted like: May-29-2020-13:51:42
  const dateStamp = Date()
    .split(' ')
    .splice(1, 4)
    .join('-');

  const spreadsheet = {
    resource: {
      properties: { title: `${dateStamp} HCMI Bulk Upload Variants Template` },
      sheets: [
        {
          properties: { title: 'Variants', index: 0 },
          data: {
            rowData: [headerRowData(variantColumnHeaders)],
          },
        },
      ],
    },
  };

  const response = await new Promise((resolve, reject) => {
    sheets.spreadsheets.create(spreadsheet, (err, data) => {
      if (err) {
        logger.error('Error occured creating google sheet for variants bulk upload template.');
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const { spreadsheetId, spreadsheetUrl } = response.data;
  const variantSheet = response.data.sheets.find(sheet => sheet.properties.title === 'Variants');

  const buildValidationRequest = (columnIndex, values) => ({
    setDataValidation: {
      range: {
        sheetId: variantSheet.properties.sheetId,
        startRowIndex: 1,
        startColumnIndex: columnIndex,
        endColumnIndex: parseInt(columnIndex) + 1,
      },
      rule: {
        condition: {
          type: 'ONE_OF_LIST',
          values: values.map(value => ({ userEnteredValue: value })),
        },
        strict: 'true',
        showCustomUi: 'true',
      },
    },
  });
  const requests = [];

  requests.push(buildValidationRequest(1, variantNames));
  requests.push(buildValidationRequest(2, variantTypes));
  requests.push(buildValidationRequest(3, variantAssessmentType));
  requests.push(buildValidationRequest(4, variantExpressionLevel));

  const dataValidationRequest = {
    spreadsheetId,
    resource: {
      requests,
    },
  };
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.batchUpdate(dataValidationRequest, (err, data) => {
      if (err) {
        logger.error(
          'Error occured updating google sheet variants bulk upload template with data validations.',
        );
        reject(err);
      } else {
        resolve({ spreadsheetUrl });
      }
    });
  });
};
