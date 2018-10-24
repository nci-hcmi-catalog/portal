export const schemaArr = [
  {
    displayName: 'Variant Name',
    accessor: 'variant_name',
    value: 'variant.name',
  },
  {
    displayName: 'Variant Type',
    accessor: 'variant_type',
    value: 'variant.type',
  },
  {
    displayName: 'Assessment Type',
    accessor: 'assessment_type',
  },
  {
    displayName: 'Expression Level',
    accessor: 'expression_level',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});

export const backupFields = schemaArr.map(field => ({
  label: field.displayName,
  value: field.value || field.accessor,
}));
