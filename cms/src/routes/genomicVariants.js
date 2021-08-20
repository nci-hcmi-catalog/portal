import express from 'express';
import Model from '../schemas/model';

import { clearGenomicVariants } from '../helpers/genomicVariants';
import VariantImporter from '../services/gdc-importer/VariantImporter';
import { fetchModelFileData, getBulkMafStatus } from '../services/gdc-importer/mafFiles';

import getLogger from '../logger';
import { IMPORT_ERRORS } from '../services/gdc-importer/gdcConstants';
const logger = getLogger('routes/genomicVariants');

const variantsRouter = express.Router();

/* Description of Endpoints

1. Clear Genomic Variants
    - Note: Stop any running import.
    Input: model name
    Output: success or error message

2. Import Genomic Variants (Single Model)
    - Fetch MAF data
    - Determine import-ability
    - Add import to queue if possible and start the queue, or return an actionable or non-actionable error
    Input: model name
    Output: success if import-able and added to queue, error otherwise

3. Import Genomic Variants (Bulk)
    - Fetch MAF data for all models
    - Check import-ability for all models
    - Add import-able models to queue and start queue, add errors to error queue
    Input: list of model names
    Output: success if models were added to appropriate queues and queue was started without issue, error otherwise

3. Check GDC for Model Import-ability
    - Fetch MAF data for input models
    - Check import-ability for models
    Input: list of model names
    Output: object with models categorized by their import-ability status

4. Get GVI Import Queue Status
    - Request lists of async import operations currently running
    Input: none
    Output: object with lists of imports in various states (queue, failed, success, stopped)

5. Audit Local DB For Model GVI Status
    - Requests genomic variant status for all models in the db
    Input: none
    Output: list of all models with genomic variants already imported, list of all models without any imported

6. Acknowledge Import Activity Has Been Seen (Single Model)
    - Acknowledges that the user has seen the import activity (success, error, stopped) for a model
    Input: model name
    Output: success if model was found in queue and acknowledged, and data for acknowledged model

7. Acknowledge Import Activity Has Been Seen (Bulk)
    - Acknowledges that the user has seen the import activity (success, error, stopped) for a list of models
    Input: list of model name
    Output: success if models were found in queue and acknowledged, and data for acknowledged models

8. Resolve Import Error Conflict
    - Selects a single MAF file to import for a model when there are multiple options available
    Input: model name, fileId, and filename for the selected file
    Output: success if model was found in queue, contained the file, and resolved; and data for resolved model

9. Stop Genomic Variant Import (Single Model)
    - Stops a given model from having its genomic variants imported if it has not already been processed
    Input: model name
    Output: success if model was found in queue and stopped, and data for stopped model

10. Stop Genomic Variant Import (Bulk)
    - Stops all waiting models from having their genomic variants imported
    Input: none
    Output: success if models were stopped, and data for stopped models
*/

variantsRouter.post('/clear/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Clearing genomic-variants for: ${name}`);
    const result = await clearGenomicVariants(name);

    if (!result) {
      res.status(400).json({
        success: false,
        error: {
          code: IMPORT_ERRORS.noMatchingModel,
          message: `Unable to clear variants for the model ${name} because it was not found in the local database.`,
        },
      });
    }

    res.status(200).json({ success: true, model: name });
  } catch (error) {
    logger.error(error, `Unexpected error clearing genomic-variants for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/import/bulk', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'Bulk import failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      success: false,
      error: {
        code: IMPORT_ERRORS.badRequest,
        message: 'Bulk import failed due to a bad request. `models` must be an array of model names.',
      },
    });
  }

  try {
    logger.debug(`Starting bulk import for models: ${models}`);

    const result = await VariantImporter.queueBulkImport(models);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, startTime: result.startTime });
  } catch (error) {
    logger.error(error, `Error occurred during bulk MAF import`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/import/:name', async (req, res) => {
  const { name } = req.params;
  const { fileId = null, filename = null } = req.body;

  try {
    logger.debug(`Beginning genomic-variant import for model ${name}`);

    // Clear first before importing new
    await clearGenomicVariants(name);

    const result = await VariantImporter.queueImport(name, fileId, filename);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, startTime: result.startTime });
  } catch (error) {
    logger.error(error, `Error occurred during genomic-variant import for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/check-gdc', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'GDC model status check failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      success: false,
      error: {
        code: IMPORT_ERRORS.badRequest,
        message: 'GDC model status check failed due to a bad request. `models` must be an array of model names.',
      },
    });
  }

  try {
    logger.debug(`Checking GDC state for models: ${models}`);
    const modelsFileData = await fetchModelFileData(models);
    const results = getBulkMafStatus(modelsFileData);

    res.status(200).json({ success: true, results });
  } catch (error) {
    logger.error(error, `Error occurred while checking GDC state for model.`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.get('/status', async (req, res) => {
  try {
    logger.debug(`Fetching active GDC Import Statuses...`);

    const status = VariantImporter.getStatus();

    res.status(200).json({ ...status });
  } catch (error) {
    logger.error(error, `Error occurred during GDC Import Status fetch`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.get('/audit', async (req, res) => {
  try {
    logger.debug(`Performing a genomic variant audit...`);

    const imported = await Model.find(
      { $and: [{ genomic_variants: { $exists: true } }, { genomic_variants: { $ne: [] } }] },
      'name',
    );
    const clean = await Model.find(
      {
        $or: [{ genomic_variants: { $exists: false } }, { genomic_variants: [] }],
      },
      'name',
    );

    return res.status(200).json({
      imported: imported.map(i => i.name),
      clean: clean.map(i => i.name),
    });
  } catch (error) {
    logger.error(error, `Error occurred during genomic variant audit`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/audit', async (req, res) => {
  const { models } = req.body;

  try {
    logger.debug(`Performing a genomic variant audit for select models...`);
    let imported = [];
    let clean = [];

    for (let i = 0; i < models.length; i++) {
      const model = await Model.findOne({ name: models[i] });
      if (model.genomic_variants && model.genomic_variants.length) {
        imported.push(models[i]);
      } else {
        clean.push(models[i]);
      }
    }

    return res.status(200).json({ imported, clean });
  } catch (error) {
    logger.error(error, `Error occurred during genomic variant audit`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/acknowledge/bulk', async (req, res) => {
  const { models } = req.body;

  if (!Array.isArray(models) || models.length < 1) {
    logger.error(
      'Bulk acknowledge failed due to a bad request. `models` must be an array of model names.',
    );
    return res.status(400).json({
      success: false,
      error: {
        code: IMPORT_ERRORS.badRequest,
        message: 'Bulk acknowledge failed due to a bad request. `models` must be an array of model names.',
      }
    });
  }

  try {
    logger.debug(`Starting bulk acknowledge for models: ${models}`);

    const acknowledged = VariantImporter.acknowledgeBulk(models);

    res.status(200).json({ acknowledged, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during bulk model acknowledge`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/acknowledge/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Acknowledging import status for model ${name}`);

    const acknowledged = VariantImporter.acknowledge(name);

    res.status(200).json({ acknowledged, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during import status acknowledgement for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/resolve', async (req, res) => {
  const { name, fileId, filename } = req.body;
  try {
    logger.debug(`Resolving import error for model ${name}`);

    const resolved = VariantImporter.resolveConflict(name, fileId, filename);

    res.status(200).json({ resolved, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during import error resolve for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/stop/all', async (req, res) => {
  try {
    logger.debug(`Stopping import for all queued models`);

    const stopped = await VariantImporter.stopBulkImport();

    res.status(200).json({ stopped, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during bulk model stop`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

variantsRouter.post('/stop/:name', async (req, res) => {
  const { name } = req.params;
  try {
    logger.debug(`Stopping import for model ${name}`);

    const stopped = await VariantImporter.stopImport(name);

    res.status(200).json({ stopped, success: true });
  } catch (error) {
    logger.error(error, `Error occurred during import stop for model ${name}`);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

export default variantsRouter;
