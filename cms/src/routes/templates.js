// @ts-check
import { ensureAuth } from '../helpers';
import { createModelUploadTemplate, createVariantUploadTemplate } from '../helpers/uploadTemplate';

import express from 'express';

import getLogger from '../logger';
const logger = getLogger('routes/templates');

const templatesRouter = express.Router();

templatesRouter.get('/model', async (req, res) => {
  try {
    const authClient = await ensureAuth(req);
    const createResponse = await createModelUploadTemplate(authClient);

    const url = createResponse.spreadsheetUrl;

    res.json({ url });
  } catch (error) {
    logger.error(error, 'Error creating model bulk upload template');
    res.status(500).json({ err: error.message });
  }
});

templatesRouter.get('/variant', async (req, res) => {
  try {
    const authClient = await ensureAuth(req);
    const createResponse = await createVariantUploadTemplate(authClient);

    const url = createResponse.spreadsheetUrl;

    res.json({ url });
  } catch (error) {
    logger.error(error, 'Error creating variant bulk upload template');
    res.status(500).json({ err: error.message });
  }
});
export default templatesRouter;
