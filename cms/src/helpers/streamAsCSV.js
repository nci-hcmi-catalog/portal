import map from 'map-stream';
import json2csv from 'json2csv';

const dataTransformer = new json2csv.Transform({}, { objectMode: true });
const dataParser = new json2csv.Parser({ header: false, flatten: true });
/** Given a mongoose schema object, produces a comma separated file. The nested objects are not exported
 * Export of nested object to is left to caller; caller can stream nested objects each as its own different file
 */
export default ({
  schemaObj,
  populate = undefined,
  dataFilters = {},
  writeHeaders,
  exportFileName,
  response,
  request,
}) => {
  // write headers
  response.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename=${exportFileName}.csv`,
  });

  if (writeHeaders) {
    response.write(`headers`);
  }

  let streamingObj = populate
    ? schemaObj.find(dataFilters).populate(populate)
    : schemaObj.find(dataFilters);

  streamingObj
    .stream()
    .pipe(
      map((dataRow, cb) => {
        let output = dataParser.parse(dataRow);
        console.log(output);
        cb(null, `${output}\n`);
      }),
    )
    .pipe(response)
    .on('error', err => response.status(500).send(err));
};
