import express from 'express';
import _ from 'lodash';
import Model from '../schemas/model';

import { clearGenomicVariants } from '../helpers/genomicVariants';
import VariantImporter from '../services/gdc-importer/VariantImporter';
import { GDC_MODEL_STATES } from '../services/gdc-importer/gdcConstants';
import { getMafStatus } from '../services/gdc-importer/mafFiles';

import getLogger from '../logger';
const logger = getLogger('routes/genomicVariants');

const variantsRouter = express.Router();

/* Description of End points required for GVI

1. Clear Genomic Variants
    - Note: Stop any running import.
    Input: model name
    Output: success or error message

2. Import Genomic Variants
    - Fetch MAF data
    - Begin async import
    - Possible error response: unable to find suitable MAF file, Unable to find model in GDC, communication error with GDC, internal error
    - If import starts wihtout issue we will need to clear the list of variants
    Input: model name
    Output: if a MAF file is available and the task could begin.

3. Get GVI import status
    - Request list of async import operations currently running
    input: none
    output: list of model names with active imports, include the start time of the import and maybe the file size?
    - this necessitates a list of completed imports and a way to acknowledge that this has been seen.

4. Acknowledge completed import activity has been seen
    input: model name
    output: success 200
*/

variantsRouter.post('/clear/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Clearing genomic-variants for: ${name}`);
    const result = await clearGenomicVariants(name);

    if (!result) {
      res.status(400).json({ success: false, message: 'Model does not exist.' });
    }
    res.status(200).json({ success: true, model: name });
  } catch (error) {
    logger.error(error, `Unexpected error clearing genomic-variants for model ${name}`);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.post('/import/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Beginning genomic-variant import for model ${name}`);

    // Clear first before importing new
    await clearGenomicVariants(name);

    const importStatus = await VariantImporter.startImport(name);

    if (importStatus.error) {
      res.status(400).json({ success: false, error: importStatus.error });
    }

    res.status(200).json({ success: true, startTime: importStatus.startTime });
  } catch (error) {
    logger.error(error, `Error occurred during genomic-variant import for model ${name}`);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.post('/check', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'GDC model status check failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      error:
        'GDC model status check failed due to a bad request. `models` must be an array of model names.',
    });
  }

  try {
    const results = Object.values(GDC_MODEL_STATES).reduce((o, key) => ({ ...o, [key]: [] }), {});
    // GDC appears to have a rate limiter on GQL requests, so split into batches
    // max. working batch size was found to be 100
    // min. working delay between batches was found to be 500ms
    const BATCH_SIZE = 100;
    const BATCH_DELAY = 500;
    const batches = _.chunk(models, BATCH_SIZE);

    for (let i = 0; i < batches.length; i++) {
      await new Promise(async (resolve, reject) => {
        await Promise.all(
          batches[i].map(async model => {
            logger.debug(`Checking GDC state for model: ${model}`);
            const modelStatus = await getMafStatus(model);
            results[modelStatus.status].push(model);
          }),
        )
          .then(_ => {
            setTimeout(() => resolve(), batches.length > 1 ? BATCH_DELAY : 0);
          })
          .catch(error => {
            logger.error(error, `Error occurred while checking GDC state for model batch ${i}`);
            reject();
            res.status(500).json({
              error: error,
            });
          });
      });
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    logger.error(error, `Error occurred while checking GDC state for model.`);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.get('/status', async (req, res) => {
  try {
    logger.debug(`Fetching active GDC Import Statuses...`);

    const imports = VariantImporter.getImports(); // TODO: get from VariantImporter

    res.status(200).json({ imports });
  } catch (error) {
    logger.error(error, `Error occurred during GDC Import Status fetch`);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.post('/acknowledge/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Acknowledging import status for model ${name}`);

    const imports = VariantImporter.acknowledgeCompleted(name);

    res.status(200).json({ imports });
  } catch (error) {
    logger.error(error, `Error occurred during import status acknowledgement for model ${name}`);
    res.status(500).json({
      error: error,
    });
  }
});

export default variantsRouter;
