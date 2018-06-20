import { saveAs } from 'filesaver.js';

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
