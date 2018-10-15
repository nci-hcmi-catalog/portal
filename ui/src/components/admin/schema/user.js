export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
  },
  {
    displayName: 'Email',
    accessor: 'email',
  },
  {
    displayName: 'Status',
    accessor: 'status',
    filter: (cellValue, filterValue) =>
      cellValue.toLowerCase().startsWith(filterValue.toLowerCase()),
  },
  {
    displayName: 'CreatedAt',
    accessor: 'createdAt',
  },
  {
    displayName: 'UpdatedAt',
    accessor: 'updatedAt',
  },
  {
    displayName: 'UpdatedBy',
    accessor: 'updatedBy',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});
