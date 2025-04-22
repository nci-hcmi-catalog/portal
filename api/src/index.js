import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import ArrangerServer from '@overture-stack/arranger-server';
import cors from 'cors';
import lastUpdatedRouter from './lastUpdated';
import healthRouter from './health';
import searchRouter from './search';
import dataExportRouter from './dataExport';
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

const appConfig = {
  configsSource: '../elasticsearch/arranger_metadata/',
  enableAdmin: process.env.ENABLE_ADMIN || false,
  enableLogs: process.env.ENABLE_LOGS || false,
  esHost: process.env.ES_HOST,
  graphqlOptions: {},
};

ArrangerServer(appConfig).then(router => {
  app.use(router);
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/health', healthRouter);
  app.use('/search', searchRouter);
  app.use('/export', dataExportRouter);

  http.listen(port, async () => {
    logger.info({ port }, 'API Started!');
  });
});
