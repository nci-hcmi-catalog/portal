import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
import { Server } from 'http';
import ArrangerServer, {type ArrangerBaseContext} from '@overture-stack/arranger-graphql-router';
import type { ConfigsObject } from '@overture-stack/arranger-types/configs';
import * as path from 'path';

import baseConfig from '../../elasticsearch/arranger_metadata/base.json' with { type: 'json' };
import extendedConfig from '../../elasticsearch/arranger_metadata/extended.json' with { type: 'json' };
import facetsConfig from '../../elasticsearch/arranger_metadata/facets.json' with { type: 'json' };
import matchboxConfig from '../../elasticsearch/arranger_metadata/matchbox.json' with { type: 'json' };
import tableConfig from '../../elasticsearch/arranger_metadata/table.json' with { type: 'json' };

import lastUpdatedRouter from './lastUpdated.js';
import healthRouter from './health.js';
import searchRouter from './search.js';
import dataExportRouter from './dataExport.js';
import getLogger from './logger.js';

const logger = getLogger('root');
const port = process.env.PORT || 5050;
const app = express();
const http = new Server(app);

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

const configs: Partial<ConfigsObject<ArrangerBaseContext>> = {
  ...baseConfig,
  esHost: process.env.ES_HOST || 'http://localhost:9200',
  esUser: process.env.ES_USER || '',
  esPass: process.env.ES_PASS || '',
  extended: extendedConfig['extended'],
  facets: facetsConfig['facets'],
  matchbox: matchboxConfig['matchbox'],
  table: tableConfig['table']
};
const appConfig = {
  configs,
  enableAdmin: process.env.ENABLE_ADMIN || false,
  enableLogs: process.env.ENABLE_LOGS || false,
  graphqlOptions: {},
};

ArrangerServer(appConfig).then((router) => {
  app.use(router);
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/health', healthRouter);
  app.use('/search', searchRouter);
  app.use('/export', dataExportRouter);

  http.listen(port, async () => {
    logger.info({ port }, 'API Started!');
  });
});
