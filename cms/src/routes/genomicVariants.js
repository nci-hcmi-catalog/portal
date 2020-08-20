import express from 'express';
import Model from '../schemas/model';

import { clearGenomicVariants } from '../helpers/genomicVariants';
import VariantImporter from '../services/gdc-importer/VariantImporter';

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

variantsRouter.get('/clear/:name', async (req, res) => {
  const { name } = req.params;
  try {
    console.log(`Clearing genomic-variants for: ${name}`);
    const result = await clearGenomicVariants(name);

    if (!result) {
      res.status(400).json({ success: false, message: 'Model does not exist.' });
    }
    res.status(200).json({ success: true, model });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.post('/import/:name', async (req, res) => {
  const { name } = req.params;
  try {
    console.log(`Beginning import of genomic-variants for: ${name}`);

    // Clear first before importing new
    await clearGenomicVariants(name);

    const importStatus = await VariantImporter.startImport(name);

    if (importStatus.error) {
      res.status(400).json({ success: false, error: importStatus.error });
    }

    res.status(200).json({ success: true, startTime: importStatus.startTime });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.get('/status', async (req, res) => {
  try {
    console.log(`Fetching active GDC Import Statuses...`);

    const imports = VariantImporter.getImports(); // TODO: get from VariantImporter

    res.status(200).json({ imports });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

variantsRouter.post('/acknowledge/:name', async (req, res) => {
  const { name } = req.params;
  try {
    console.log(`Acknowledging import status for: ${name}`);

    const imports = VariantImporter.acknowledgeCompleted(name); // TODO: get from VariantImporter

    res.status(200).json({ imports });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

export default variantsRouter;
