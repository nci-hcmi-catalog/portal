// @ts-check
import express from 'express';
import bodyParser from 'body-parser';
import { dataStream } from '@arranger/server/dist/download';
import { getProject } from '@arranger/server/dist/utils/projects';
import map from 'map-stream';

import getLogger from './logger';
const logger = getLogger('dataExport');

const dataExportRouter = express.Router();
const NEW_LINE = '\n';

dataExportRouter.use(bodyParser.urlencoded({ extended: true }));

dataExportRouter.post('/:projectId/models', async (req, res) => {
  const projectId = req.params['projectId'];
  const project = getProject(projectId);
  const es = project.es;
  // sanitize user input
  const params = req.sanitize(req.body.params);
  console.time('download');
  try {
    const { output } = await dataStream({
      es,
      projectId,
      params: getParamsObj(params),
      fileType: 'tsv',
    });
    const { fileName, outputContentType, fields } = getOutputDetails(params);
    res.set('Content-Type', outputContentType);
    res.set('Content-disposition', `attachment; filename=${fileName}`);
    output
      .pipe(
        map((dataRow, cb) => {
          cb(null, `${dataRow}${NEW_LINE}`);
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
  } catch (error) {
    logger.error({ error }, 'Failure exporting model TSV');
    res.status(400).send(error.message || error.details || 'An unknown error occurred.');
  }
});

const getParamsObj = params => {
  const paramsObj = JSON.parse(params);
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
        fileType: fileDetails.fileType,
      }
    : {};
};

export default dataExportRouter;
