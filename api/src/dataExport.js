// @ts-check
import express from 'express';
import bodyParser from 'body-parser';
import { dataStream } from '@arranger/server/dist/download';
import { getProject } from '@arranger/server/dist/utils/projects';
import getAllData from '@arranger/server/dist/utils/getAllData';
import JSZip from 'jszip';
import map from 'map-stream';
import through2 from 'through2';
const { Transform } = require('readable-stream');

import getLogger from './logger';
const logger = getLogger('dataExport');

const dataExportRouter = express.Router();
const NEW_LINE = '\n';

dataExportRouter.use(bodyParser.urlencoded({ extended: true }));

dataExportRouter.post('/:projectId/models', async (req, res) => {
  try {
    const projectId = req.params['projectId'];
    logger.debug(`projectId: ${projectId}`);
    const project = getProject(projectId);
    const es = project.es;
    // sanitize user input
    const params = getParamsObj(req.sanitize(req.body.params));
    logger.debug(`params: ${JSON.stringify(params)}`);
    const file = params.files[0];
    const { index, sqon } = file;

    const genomicVariantData = {};
    const clinicalVariantData = {};

    console.time('download');

    /**
     * Collect Variant Data for all models, filtered by sqon
     *
     * We can get a stream from arranger using the getAllData method and then can store the variant data for each model
     * for future processing.
     */
    const allDataStream = await getAllData({ projectId, sqon, es, index });
    const collectVariantData = through2.obj(function({ hits }, enc, callback) {
      const models = hits.map(h => h._source);
      models.forEach(model => {
        if (model.genomic_variants && model.genomic_variants.length > 0) {
          genomicVariantData[model.name] = model.genomic_variants;
        }
        if (model.variants && model.variants.length > 0) {
          clinicalVariantData[model.name] = model.variants;
        }
      });
      logger.debug(`allData pipe`);
      callback(null, '');
    });
    await new Promise((resolve, reject) => {
      allDataStream
        .pipe(collectVariantData)
        .on('finish', () => resolve())
        .on('error', reject);
    });

    /**
     * Use Arranger's download tool dataStream to fetch the tsv for the search table
     */
    const { output } = await dataStream({
      es,
      projectId,
      params,
      fileType: 'tsv',
    });
    const models = [];

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
          // Use empty string in .join('') to prevent commas at the start of every line in the TSV
          resolve(tsvData.join(''));
        });
    }).catch(err => {
      logger.error(`Error processing downlaod TSV data stream from arranger: ${err}`);
      return res.status(500).send(err);
    });

    /**
     * Build a zip file that includes the search table TSV file, and then add folders for each model with variant data
     */
    const zip = new JSZip();
    zip.file('model-table.tsv', modelsTsv);

    await Promise.all(
      models.map(async modelId => {
        // Get Clinical and Somatic variants for the model
        const clinicalVariants = await buildVariantTsv(clinicalVariantData[modelId]);
        const genomicVariants = await buildVariantTsv(genomicVariantData[modelId]);
        if (clinicalVariants || genomicVariants) {
          const modelFolder = zip.folder(modelId);
          !!clinicalVariants && modelFolder.file(`clinical-${modelId}.tsv`, clinicalVariants);
          !!genomicVariants && modelFolder.file(`somatic-${modelId}.tsv`, genomicVariants);
        }
      }),
    );

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

const buildVariantTsv = async data => {
  if (!data) {
    return null;
  } else {
    const keys = Object.keys(data[0]);
    const records = data.map(record => {
      const row = [];
      keys.forEach(key => {
        row.push(record[key]);
      });
      return row.join('\t');
    });
    const headerRow = keys.join('\t');
    const output = [headerRow, ...records].join('\n');
    return output;
  }
};

const getParamsObj = params => {
  const paramsObj = JSON.parse(params);
  return paramsObj;
};

export default dataExportRouter;
