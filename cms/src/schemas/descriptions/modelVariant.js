export const schemaArr = [
  {
    displayName: 'Variant Name',
    accessor: 'variant_name',
  },
  {
    displayName: 'Variant Type',
    accessor: 'variant_type',
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
