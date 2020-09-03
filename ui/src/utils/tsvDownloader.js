import { saveAs } from 'filesaver.js';
import { clone } from 'lodash';
/**
 * Given a array of like objects, transform keys to header
 * row and then output each object values as a row in a tsv
 * format export with fileName
 * @param {String} fileName - filename without extension
 * @param {[Object]} objArr - array of like objects
 */
export default function(fileName, objArr) {
  saveAs(
    new Blob(
      [
        [
          Object.keys(objArr[0]).join('\t'),
          ...objArr.map(obj =>
            Object.values(addColumnSpecificCustomizations(obj))
              .map(value => (value ? (typeof value === 'string' ? value : value.export) : ''))
              .join('\t'),
          ),
        ].join('\n'),
      ],
      { TSV: 'text/tab-separated-values' },
    ),
    `${fileName}.tsv`,
  );
}

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
