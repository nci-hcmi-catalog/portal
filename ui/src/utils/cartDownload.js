import download from '@overture-stack/arranger-components/dist/utils/download';
import globals from 'utils/globals';

const query = `query ModelColumns {
  model {
    configs {
      table {
        columns {
          fieldName
          accessor
          show
        }
      }
      extended  
    }
  }
}`;

async function fetchColumns(apiFetcher) {
  const { data } = await apiFetcher({
    endpointTag: `columnsStateQuery`,
    body: {
      query,
    },
  });

  const columns = data?.model?.configs?.table?.columns || [];
  const extended = data?.model?.configs?.extended || [];

  const output = [];
  columns.forEach((column) => {
    const extendedData = extended.find((i) => i.fieldName === column.fieldName);
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

const cartDownload = async function (selectedIds, apiFetcher, selectedColumns) {
  const sqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: { fieldName: '_id', value: selectedIds },
      },
    ],
  };

  const columns = selectedColumns ? selectedColumns : await fetchColumns(apiFetcher);

  const params = { files: [{ index: 'model', sqon, columns }] };

  return download({
    method: 'post',
    url: `${globals.ARRANGER_API}/export/models`,
    params,
  });
};

export default cartDownload;
