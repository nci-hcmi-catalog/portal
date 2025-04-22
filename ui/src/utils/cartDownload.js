import download from '@arranger/components/dist/utils/download';
import defaultApi from '@arranger/components/dist/utils/api';

import globals from 'utils/globals';

async function fetchColumns() {
  const { data } = await defaultApi({
    endpoint: `/graphql/columnsStateQuery`,
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
  columns.forEach((column) => {
    const extendedData = extended.find((i) => i.field === column.field);
    const extendedColumn = {
      ...column,
      ...extendedData,
      Header: extendedData.displayName || column.field,

      // display values and type are renamed by arranger into extendedDisplayValues and extendedDisplayType before being sent into the tsv downloader.
      extendedDisplayValues: extendedData.displayValues,
      extendedDisplayType: extendedData.type,
    };
    output.push(extendedColumn);
  });

  return output;
}

const cartDownload = async function (selectedIds) {
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
    url: `${globals.ARRANGER_API}/export/models`,
    params,
  });
};

export default cartDownload;
