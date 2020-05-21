import { trimEnd } from 'lodash';

export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
  },
  {
    displayName: 'Expanded',
    accessor: 'expanded',
  },
  {
    displayName: 'Model Type',
    accessor: 'type',
  },
  {
    displayName: 'Doubling Time',
    accessor: 'growth_rate',
  },
  {
    displayName: 'Split Ratio',
    accessor: 'split_ratio',
    value: row => (typeof row.split_ratio === 'undefined' ? undefined : `'${row.split_ratio}`),
  },
  { displayName: 'Time to Split', accessor: 'time_to_split' },
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
    value: row =>
      typeof row.chemotherapeutic_drugs === 'undefined'
        ? undefined
        : row.chemotherapeutic_drugs
        ? `Yes`
        : `No`,
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
    displayName: 'Molecular Characterizations',
    accessor: 'molecular_characterizations',
    // value field is used by backup feature
    value: row =>
      trimEnd(row.molecular_characterizations.reduce((acc, item) => acc + `${item}|`, ``), `|`),
  },
  { displayName: 'Tissue Type', accessor: 'tissue_type' },

  {
    displayName: 'Clinical Tumor Diagnosis',
    accessor: 'clinical_tumor_diagnosis',
  },
  {
    displayName: 'Histological Subtype',
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
    displayName: 'Licensing Required',
    accessor: 'licensing_required',
    value: row =>
      typeof row.licensing_required === 'undefined'
        ? undefined
        : row.licensing_required
        ? `Yes`
        : `No`,
  },
  { displayName: 'Link to Distributor', accessor: 'distributor_part_number' },
  {
    displayName: 'Model URL',
    accessor: 'source_model_url',
  },
  {
    displayName: 'Sequence URL',
    accessor: 'source_sequence_url',
  },
  {
    displayName: 'Somatic MAF URL',
    accessor: 'somatic_maf_url',
  },
  {
    displayName: 'Has Matched Models',
    accessor: 'has_matched_models',
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
