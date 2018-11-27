// @ts-check
import express from 'express';
import bodyParser from 'body-parser';
import { dataStream } from '@arranger/server/dist/download';
import { getProject } from '@arranger/server/dist/utils/projects';
import map from 'map-stream';

const dataExportRouter = express.Router();
const NEW_LINE = '\n';

dataExportRouter.use(bodyParser.urlencoded({ extended: true }));

dataExportRouter.post('/:projectId/models', async (req, res) => {
  const projectId = req.params['projectId'];
  const project = getProject(projectId);
  const es = project.es;
  const { params } = req.body;
  console.time('download');
  try {
    const { output } = await dataStream({
      es,
      projectId,
      params: getParamsObj(params),
      fileType: 'json',
    });
    const { fileName, outputContentType, fields } = getOutputDetails(params);
    res.set('Content-Type', outputContentType);
    res.set('Content-disposition', `attachment; filename=${fileName}`);
    output
      .pipe(
        map((dataRow, cb) => {
          const rowData = JSON.parse(dataRow);
          let output = rowToTSV(rowData, fields);
          cb(null, `${output}${NEW_LINE}`);
        }),
      )
      .pipe(res)
      .on('error', err => {
        res.status(500).write(err);
        res.end();
      })
      .on('finish', () => {
        console.timeEnd('download');
      });
  } catch (err) {
    res.status(400).send(err.message || err.details || 'An unknown error occurred.');
  }
});

const getParamsObj = params => {
  const paramsObj = JSON.parse(params);
  // reset file type to JSON
  // Arranger will stream data in JSON; and that allows application to apply customization to each column's value
  // before sending response back to the client
  paramsObj.files = setFilesExportTypeAsJSON(paramsObj);
  return paramsObj;
};

const getOutputDetails = params => {
  // return details of the first file as HCMI needs to export only one file for download
  const paramsObj = JSON.parse(params);
  const fileDetails = (paramsObj.files || [])[0];
  return fileDetails
    ? {
        fileName: fileDetails.fileName,
        outputContentType: `text/${fileDetails.fileType}`,
        fields: fileDetails.columns.filter(col => col.show).map(col => col.accessor),
      }
    : {};
};
const setFilesExportTypeAsJSON = ({ files = [] }) =>
  files.map(item => ({ ...item, fileType: 'json' }));

const rowToTSV = (row, fields) => {
  const customizedRow = addColumnSpecificCustomizations(row);
  // extracting it using a field map guarantees each row will have fields in same order
  // using lodash values may or may not guarantee that
  return fields.map(filedAccessor => customizedRow[filedAccessor]).join('\t');
};

const addColumnSpecificCustomizations = row => ({
  ...row,
  split_ratio: (`${row['split_ratio']}` || '').includes(':')
    ? `'${row['split_ratio']}`
    : row['split_ratio'],
});

export default dataExportRouter;
