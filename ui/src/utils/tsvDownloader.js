import { saveAs } from 'filesaver.js';
import { clone } from 'lodash';

/**
 * Given a array of table data objects, transform keys to header
 * row and then output each object values as a row in a tsv
 * format export with fileName
 * @param {String} fileName - filename without extension
 * @param {[Object]} tableData - array of like objects
 * @param {[String]} columnOrder - ordered array of column headers
 */
const tsvDownloader = function(fileName, tableData, columnOrder = []) {
  saveAs(
    new Blob(
      [
        [
          (columnOrder.length ? columnOrder : Object.keys(tableData[0])).join('\t'),
          ...tableData.map(row =>
            orderColumns(addColumnSpecificCustomizations(row), columnOrder)
              .map(value => (value ? (typeof value === 'string' ? value : value.export) : ''))
              .join('\t'),
          ),
        ].join('\n'),
      ],
      { TSV: 'text/tab-separated-values' },
    ),
    `${fileName}.tsv`,
  );
};

const addColumnSpecificCustomizations = row => {
  const output = clone(row);
  if (output['split_ratio']) {
    output['split_ratio'] = (`${output['split_ratio']}` || '').includes(':')
      ? `'${output['split_ratio']}`
      : output['split_ratio'];
  }
  if (output.gene && output.gene.name) {
    // Genopmic Variant gene data is a nested object to handle the link out that uses entrez_id
    // it needs to be simplified down for the tsv.
    output.gene = output.gene.name;
  }
  return output;
};

const orderColumns = (data, columnOrder) => {
  if (!columnOrder || !columnOrder.length) {
    return Object.values(data);
  }

  return columnOrder.map(col => data[col]);
};

export const convertColumnsToTableData = (columnHeaders, columnData) => {
  const tableData = [];
  let longestColumnIndex = 0;

  for (let i = 0; i < columnHeaders.length; i++) {
    if (columnData[i].length > columnData[longestColumnIndex].length) {
      longestColumnIndex = i;
    }
  }

  for (let i = 0; i < columnData[longestColumnIndex].length; i++) {
    let row = {};

    for (let j = 0; j < columnHeaders.length; j++) {
      row[columnHeaders[j].accessor] = columnData[j][i] || '';
    }

    tableData.push(row);
  }

  return tableData;
};

export default tsvDownloader;
