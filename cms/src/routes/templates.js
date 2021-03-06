// @ts-check
import { ensureAuth } from '../helpers';
import { createModelUploadTemplate, createVariantUploadTemplate } from '../helpers/uploadTemplate';

import express from 'express';
import fs from 'fs';
import path from 'path';

import getLogger from '../logger';
const logger = getLogger('routes/templates');

const templatesRouter = express.Router();

const streamServerFile = (filePath, response) => {
  const absoluteFilePath = path.join(__dirname, filePath);
  // stream file if it exists
  fs.exists(absoluteFilePath, exists => {
    if (exists) {
      response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${path.basename(absoluteFilePath)}.xlsx`,
      });

      fs.createReadStream(absoluteFilePath).pipe(response);
    } else {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('This template is not available.');
    }
  });
};

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
