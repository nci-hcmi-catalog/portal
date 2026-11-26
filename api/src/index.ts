import ArrangerRouter, { type ArrangerBaseContext, wrapOpenSearchClient } from '@overture-stack/arranger-graphql-router';
import type { ConfigsObject, ExtendedConfigs, FacetsConfigs, MatchBoxConfigs, TableConfigs } from '@overture-stack/arranger-types/configs';
import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
import { Server } from 'http';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as path from 'path';

import baseConfig from '../../elasticsearch/arranger_metadata/base.json' with { type: 'json' };
import extendedConfigFile from '../../elasticsearch/arranger_metadata/extended.json' with { type: 'json' };
import facetsConfigFile from '../../elasticsearch/arranger_metadata/facets.json' with { type: 'json' };
import matchboxConfigFile from '../../elasticsearch/arranger_metadata/matchbox.json' with { type: 'json' };
import tableConfigFile from '../../elasticsearch/arranger_metadata/table.json' with { type: 'json' };

import dataExportRouter from './dataExport.js';
import healthRouter from './health.js';
import lastUpdatedRouter from './lastUpdated.js';
import getLogger from './logger.js';
import pm2 from './pm2.ts';
import searchRouter from './search.js';
import getClient from './services/searchClient.ts';

const logger = getLogger('API root');
const port = process.env.PORT || 5050;
const app = express();
const http = new Server(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // each route is responsible for sanitization
app.use(cors());

// Swagger
app.use('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../redoc.html'));
});
app.use('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname, '../swagger.json'));
});

// Arranger Configs
// TODO: Fix Type coercion / Update Arranger ExtendedConfigs['type'] definition
const extendedConfigs = extendedConfigFile['extended'] as ExtendedConfigs[];
const facetConfigs: FacetsConfigs = facetsConfigFile['facets'];
const matchboxConfigs: MatchBoxConfigs[] = matchboxConfigFile['matchbox'];
const tableConfigs: TableConfigs = tableConfigFile['table'];

const disableGraphQLIntrospection = process.env.DISABLE_GRAPHQL_INTROSPECTION === 'true' || pm2.DISABLE_GRAPHQL_INTROSPECTION || false;
const esHost = process.env.ES_HOST || pm2.ES_URL || 'http://localhost:9200';

const configs: Partial<ConfigsObject<ArrangerBaseContext>> = {
  ...baseConfig,
  disableGraphQLIntrospection,
  esHost,
  esIndex: 'hcmi',
  extended: extendedConfigs,
  enableDebug: true,
  facets: facetConfigs,
  matchbox: matchboxConfigs,
  maxDepth: 10,
  table: tableConfigs
};

const esClient = getClient(pm2);

ArrangerRouter({ configs, esClient: wrapOpenSearchClient(esClient) }).then((router) => {
  app.use(router);
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/health', healthRouter);
  app.use('/search', searchRouter);
  app.use('/export', dataExportRouter);

  http.listen(port, async () => {
    logger.info({ port }, 'API Started!');
  });
});
