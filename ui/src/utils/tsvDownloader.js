import { saveAs } from 'filesaver.js';

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
            Object.values(obj)
              .map(value => (typeof value === 'string' ? value : value.export))
              .join('\t'),
          ),
        ].join('\n'),
      ],
      { TSV: 'text/tab-separated-values' },
    ),
    `${fileName}.tsv`,
  );
}
