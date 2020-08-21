import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import Arranger from '@arranger/server';
import cors from 'cors';
import lastUpdatedRouter from './lastUpdated';
import healthRouter from './health';
import dataExportRouter from './dataExport';
import cmsDataRouter from './cmsData';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import expressSanitizer from 'express-sanitizer';
import * as path from 'path';

import getLogger from './logger';
const logger = getLogger('root');

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // each route is responsible for sanitization
app.use(cors());

//swagger
app.use('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../redoc.html'));
});
app.use('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
});

app.use('/data', cmsDataRouter);

Arranger().then(router => {
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/health', healthRouter);
  app.use('/export', dataExportRouter);
  app.use(router);

  http.listen(port, async () => {
    logger.info({ port }, 'API Started!');
  });
});
