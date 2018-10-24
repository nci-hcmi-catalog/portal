import map from 'map-stream';
import json2csv from 'json2csv';
import { trimEnd } from 'lodash';
const NEW_LINE = '\n';
/** Given a mongoose schema object, produces a comma separated file. The nested objects are not exported
 * Export of nested object to is left to caller; caller can stream nested objects each as its own different file
 */
export default ({
  schemaObj = undefined,
  data = undefined,
  fields = [],
  populate = undefined,
  dataFilters = {},
  writeHeaders,
  exportFileName,
  response,
}) => {
  const dataParser = new json2csv.Parser({ header: false, flatten: true, fields });
  // write headers
  response.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename=${exportFileName}.csv`,
  });

  if (writeHeaders) {
    const headerRow = fields.reduce((acc, field) => acc + `${field.label},`, ``);
    response.write(`${trimEnd(headerRow, ',')}${NEW_LINE}`);
  }

  if (schemaObj) {
    let streamingObj = populate
      ? schemaObj.find(dataFilters).populate(populate)
      : schemaObj.find(dataFilters);

    streamingObj
      .stream()
      .pipe(
        map((dataRow, cb) => {
          let output = dataParser.parse(dataRow);
          cb(null, `${output}${NEW_LINE}`);
        }),
      )
      .pipe(response)
      .on('error', err => {
        response.status(500).write(err);
        response.end();
      });
  } else if (data) {
    response.write(dataParser.parse(data));
    response.end();
  } else {
    response.end();
  }
};
