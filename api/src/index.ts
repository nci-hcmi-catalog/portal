import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
import { Server } from 'http';
import ArrangerRouter, { type ArrangerBaseContext } from '@overture-stack/arranger-graphql-router';
import type { ConfigsObject, DisplayType,  ExtendedConfigs, FacetsConfigs, MatchBoxConfigs, SearchEngineType, TableConfigs } from '@overture-stack/arranger-types/configs';
import * as path from 'path';

import baseConfig from '../../elasticsearch/arranger_metadata/base.json' with { type: 'json' };
import extendedConfigFile from '../../elasticsearch/arranger_metadata/extended.json' with { type: 'json' };
import facetsConfigFile from '../../elasticsearch/arranger_metadata/facets.json' with { type: 'json' };
import matchboxConfigFile from '../../elasticsearch/arranger_metadata/matchbox.json' with { type: 'json' };
import tableConfigFile from '../../elasticsearch/arranger_metadata/table.json' with { type: 'json' };

import pm2Config from './../pm2.config.js';

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

const displayTypeValues: DisplayType[] = ['all' , 'bits' , 'boolean' , 'bytes' , 'date' , 'list' , 'nested' , 'number'];

const extendedConfigs: ExtendedConfigs[] = extendedConfigFile['extended'].map(configRecord => {
  const {type: stringType} = configRecord;
  const displayType = displayTypeValues.find(type => stringType === type) || 'all';
  return {...configRecord, type: displayType};
});
const facetConfigs: FacetsConfigs = facetsConfigFile['facets'];
const matchboxConfigs: MatchBoxConfigs[] = matchboxConfigFile['matchbox'];
const tableConfigs: TableConfigs = tableConfigFile['table'];

type pm2EnvValues = 'dev' | 'prd' | 'staging';
const pm2EnvValues = ['dev' , 'prd' , 'staging'];
const pm2Env: pm2EnvValues = process.env.ENV && pm2EnvValues.includes(process.env.ENV) ? process.env.ENV as pm2EnvValues : 'dev';
const pm2ConfigGeneric =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0].env) || {};
const pm2ConfigForEnv =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0][`env_${pm2Env}`]) || {};

export const pm2 = { ...pm2ConfigGeneric, ...pm2ConfigForEnv };

const clientType = (process.env.SEARCH_CLIENT_TYPE || pm2.SEARCH_CLIENT_TYPE) as SearchEngineType || 'opensearch';
const esHost = process.env.ES_HOST || pm2.ES_URL || 'http://localhost:9200';
const esUser = process.env.ES_USER || pm2.ES_USER || '';
const esPass = process.env.ES_PASS || pm2.ES_PASS || '';

const configs: Partial<ConfigsObject<ArrangerBaseContext>> = {
  ...baseConfig,
  esHost,
  esUser,
  esPass,
  esIndex: 'hcmi',
  extended: extendedConfigs,
  facets: facetConfigs,
  matchbox: matchboxConfigs,
  maxDepth: 10,
  searchEngine: clientType,
  table: tableConfigs
};

ArrangerRouter({configs}).then((router) => {
  app.use(router);
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/health', healthRouter);
  app.use('/search', searchRouter);
  app.use('/export', dataExportRouter);

  http.listen(port, async () => {
    logger.info({ port }, 'API Started!');
  });
});
