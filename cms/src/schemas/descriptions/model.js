import { trimEnd } from 'lodash';

export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
  },
  {
    displayName: 'Type',
    accessor: 'type',
  },
  {
    displayName: 'Growth Rate',
    accessor: 'growth_rate',
  },
  {
    displayName: 'Split Ratio',
    accessor: 'split_ratio',
  },
  {
    displayName: 'Gender',
    accessor: 'gender',
  },
  {
    displayName: 'Race',
    accessor: 'race',
  },
  {
    displayName: 'Age At Diagnosis',
    accessor: 'age_at_diagnosis',
  },
  {
    displayName: 'Age At Sample Acquisition',
    accessor: 'age_at_sample_acquisition',
  },
  {
    displayName: 'Date of Availability',
    accessor: 'date_of_availability',
  },
  {
    displayName: 'Primary Site',
    accessor: 'primary_site',
  },
  {
    displayName: 'TNM Stage',
    accessor: 'tnm_stage',
  },
  {
    displayName: 'Neoadjuvant Therapy',
    accessor: 'neoadjuvant_therapy',
  },
  {
    displayName: 'Chemotherapeutic Drugs',
    accessor: 'chemotherapeutic_drugs',
  },
  {
    displayName: 'Disease Status',
    accessor: 'disease_status',
  },
  {
    displayName: 'Vital Status',
    accessor: 'vital_status',
  },
  {
    displayName: 'Therapy',
    accessor: 'therapy',
    // value field is used by backup feature
    value: row => trimEnd(row.therapy.reduce((acc, item) => acc + `${item}|`, ``), `|`),
  },
  {
    displayName: 'Molecular Characterization',
    accessor: 'molecular_characterizations',
    // value field is used by backup feature
    value: row =>
      trimEnd(row.molecular_characterizations.reduce((acc, item) => acc + `${item}|`, ``), `|`),
  },
  {
    displayName: 'Clinical Tumor Diagnosis',
    accessor: 'clinical_tumor_diagnosis',
  },
  {
    displayName: 'Histological Type',
    accessor: 'histological_type',
  },
  {
    displayName: 'Clinical Stage Grouping',
    accessor: 'clinical_stage_grouping',
  },
  {
    displayName: 'Site Of Sample Acquisition',
    accessor: 'site_of_sample_acquisition',
  },
  {
    displayName: 'Tumor Histological Grade',
    accessor: 'tumor_histological_grade',
  },
  {
    displayName: 'Licensing Requirements',
    accessor: 'licensing_required',
  },
  {
    displayName: 'Model URL',
    accessor: 'source_model_url',
  },
  {
    displayName: 'Sequence URL',
    accessor: 'source_sequence_url',
  },
  {
    displayName: 'Updated By',
    accessor: 'updatedBy',
  },
  {
    displayName: 'Created At',
    accessor: 'createdAt',
  },
  {
    displayName: 'Updated At',
    accessor: 'updatedAt',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});

const excludeFromBackup = ['updatedBy', 'updatedAt', 'createdAt'];

export const backupFields = schemaArr
  .filter(field => !excludeFromBackup.includes(field.accessor))
  .map(field => ({
    label: field.displayName,
    value: field.value || field.accessor,
  }));
