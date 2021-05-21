import download from '@arranger/components/dist/utils/download';
import defaultApi from '@arranger/components/dist/utils/api';

import globals from 'utils/globals';

async function fetchColumns() {
  const { data } = await defaultApi({
    endpoint: `${globals.VERSION}/graphql/columnsStateQuery`,
    body: {
      query: `query {
            models {
              columnsState {
                state {
                  columns {
                    field
                    accessor
                    show
                  }
                }
              }
              extended 
            }
            
          }
          `,
    },
  });

  const columns = data?.models?.columnsState?.state?.columns || [];
  const extended = data?.models?.extended || [];

  const output = [];
  columns.forEach(column => {
    const extendedData = extended.find(i => i.field === column.field);
    const extendedColumn = {
      ...column,
      ...extendedData,
      Header: extendedData.displayName || column.field,
    };
    output.push(extendedColumn);
  });

  console.log('fetchColumns', output);
  return output;
}

export default async function(selectedIds) {
  await fetchColumns();

  const sqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: { field: '_id', value: selectedIds },
      },
    ],
  };

  const columns = await fetchColumns();

  const params = { files: [{ index: 'models', sqon, columns }] };
  return download({
    method: 'post',
    url: `${globals.ARRANGER_API}/export/${globals.VERSION}/models`,
    params,
  });
}
