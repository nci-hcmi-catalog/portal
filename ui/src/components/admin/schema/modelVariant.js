export const schemaArr = [
  {
    displayName: 'Variant',
    accessor: 'variant',
  },
  {
    displayName: 'Assessment Type',
    accessor: 'assessmentType',
  },
  {
    displayName: 'Expression Level',
    accessor: 'expressionLevel',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});
