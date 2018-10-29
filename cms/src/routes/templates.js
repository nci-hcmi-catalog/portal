// @ts-check

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
        'Content-Disposition': `attachment; filename=${path.basename(absoluteFilePath)}.csv`,
      });

      fs.createReadStream(absoluteFilePath).pipe(response);
    } else {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('This template is not available.');
    }
  });
};

templatesRouter.get('/models', async (req, res) => {
  streamServerFile('../../templates/bulk-model-upload.csv', res);
});

templatesRouter.get('/variants', async (req, res) => {
  streamServerFile('../../templates/bulk-variant-upload.csv', res);
});
export default templatesRouter;
