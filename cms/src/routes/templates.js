// @ts-check
import { ensureAuth } from '../helpers';
import { createModelUploadTemplate } from '../helpers/uploadTemplate';

import express from 'express';
import fs from 'fs';
import path from 'path';
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

templatesRouter.get('/models', async (req, res) => {
  try {
    const authClient = await ensureAuth(req);
    const createResponse = await createModelUploadTemplate(authClient);

    const url = createResponse.spreadsheetUrl;

    res.json({ url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

templatesRouter.get('/variants', async (req, res) => {
  streamServerFile('../../templates/bulk-variant-upload.xlsx', res);
});
export default templatesRouter;
