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

const modelIdsQuery = `query ModelIds($first: Int, $sqon: JSON) {
  model {
    hits(filters: $sqon, first: $first) {
      total
      edges {
        node {
          id
        }
      }
    }
  }
}`;

const fetchModelIds = async (apiFetcher, sqon) => {
  const { data } = await apiFetcher({
    endpointTag: `modelIdsQuery`,
    body: {
      query: modelIdsQuery,
      variables: {
        first: 1000,
        sqon,
      },
    },
  });

  return data?.model?.hits?.edges.map((edge) => edge.node.id) || [];
};

const cartDownload = async function (selectedIds, apiFetcher, sqon, selectedColumns) {
  const modelIds = [];

  if (selectedIds.length) {
    // if selectedIds, download those models
    modelIds.push(...selectedIds);
  } else if (sqon) {
    // if no selectedIds but sqon, fetch model IDs based on sqon, then download those models
    const fetchedModelIds = await fetchModelIds(apiFetcher, sqon);
    modelIds.push(...fetchedModelIds);
  } else {
    // if no selectedIds and no sqon, download ALL models
    // (don't need to do anything here, modelIds will be empty)
  }

  const downloadSqon = {
    op: 'and',
    content: modelIds.length
      ? [
          {
            op: 'in',
            content: { fieldName: '_id', value: modelIds },
          },
        ]
      : [],
  };

  const columns = selectedColumns ? selectedColumns : await fetchColumns(apiFetcher);

  const params = { files: [{ index: 'model', sqon: downloadSqon, columns }] };

  return download({
    method: 'post',
    url: `${globals.ARRANGER_API}/export/models`,
    params,
  });
};

export default cartDownload;
