import { schemaArr } from '@hcmi-portal/cms/src/schemas/descriptions/modelGenomicVariant';

const selectedColumns = ['gene', 'aa_change', 'transcript_id', 'consequence_type', 'class', 'type'];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const customColumns = [
  {
    Header: 'Variant',
    accessor: 'actions',
    Cell: ({ original: { chromosome, start_position, specific_change } }) => {
      return `${chromosome}:g.${start_position}${specific_change}`;
    },
  },
];

export const ModelGenomicVariantColumns = customColumns.concat(columns);
