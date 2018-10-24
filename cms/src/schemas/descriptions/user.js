import { filters } from '../../helpers/dataFilters';

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
    queryFilter: filters.startsWith,
  },
  {
    displayName: 'Created At',
    accessor: 'createdAt',
  },
  {
    displayName: 'Updated At',
    accessor: 'updatedAt',
  },
  {
    displayName: 'Updated By',
    accessor: 'updatedBy',
  },
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});
