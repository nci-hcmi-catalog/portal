export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
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
