export const schemaArr = [
  {
    displayName: 'Variant',
    accessor: 'variant',
  },
  {
    displayName: 'Gene',
    accessor: 'gene',
  },
  {
    displayName: 'AA Change',
    accessor: 'aa_change',
  },
  {
    displayName: 'Transcript',
    accessor: 'transcript_id',
  },
  {
    displayName: 'Consequence',
    accessor: 'consequence_type',
  },
  {
    displayName: 'Class',
    accessor: 'class',
  },
  {
    displayName: 'Type',
    accessor: 'type',
  },
  {
    displayName: 'Chromosome',
    accessor: 'chromosome',
  },
  {
    displayName: 'Start Position',
    accessor: 'start_position',
  },
  {
    displayName: 'Specific Change',
    accessor: 'specific_change',
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
