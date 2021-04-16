// @ts-check
import express from 'express';
import bodyParser from 'body-parser';
import { dataStream } from '@arranger/server/dist/download';
import { getProject } from '@arranger/server/dist/utils/projects';
import JSZip from 'jszip';
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

    const models = [];

    const zip = new JSZip();
    const modelsTsv = await new Promise((resolve, reject) => {
      const tsvData = [];
      let firstRow = true;
      output
        .pipe(
          map((dataRow, cb) => {
            // Add model to our list
            if (firstRow) {
              firstRow = false;
            } else {
              const modelId = dataRow.split('\t')[0];
              models.push(modelId);
            }

            tsvData.push(dataRow);
            cb(null, `${dataRow}`);
          }),
        )
        .on('error', err => {
          reject(err);
        })
        .on('end', () => {
          resolve(tsvData.join());
        });
    }).catch(err => {
      logger.error(`Error processing downlaod TSV data stream from arranger: ${err}`);
      return res.status(500).send(err);
    });
    zip.file('model-table.tsv', modelsTsv);

    models.forEach(modelId => {
      // Get Clinical and Somatic variants for the model
      // TODO: Get the variant TSVs instead of placeholder data
      const clinicalVariants = `Clinical\tTSV\nPlaceholder\t${modelId}`;
      const somaticVariants = `Somatic\tTSV\${modelId}\Placeholder`;
      const modelFolder = zip.folder(modelId);
      modelFolder.file(`clinical-${modelId}.tsv`, clinicalVariants);
      modelFolder.file(`somatic-${modelId}.tsv`, somaticVariants);
    });

    // Return zipfile
    res.set('Content-Type', 'application/zip');
    res.set('Content-disposition', `attachment; filename=hcmi-models-export.zip`);
    const zipfile = zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(res)
      .on('error', err => {
        res.status(500).write(err);
        res.end();
      })
      .on('finish', () => {
        console.timeEnd('download');
      });
  } catch (error) {
    logger.error(error, 'Failure exporting model TSV');
    res.status(400).send(error.message || error.details || 'An unknown error occurred.');
  }
});

const getParamsObj = params => {
  const paramsObj = JSON.parse(params);
  return paramsObj;
};

export default dataExportRouter;
