import express from 'express';
import _ from 'lodash';

import getClient from './services/searchClient.ts';

const startTime = Date.now();
const healthRouter = express.Router();

healthRouter.get('/', async (req, res) => {
  const uptime = Date.now() - startTime;
  res.status(200).json({ status: 'ok', startTime, uptime });
});

healthRouter.get('/es', async (req, res) => {
  try {
    const client = await getClient();
    const status = await client.ping();
    if (_.get(status, 'statusCode') === 200) {
      const response = _.omit(status, 'meta');
      res.status(200).json({ response });
    } else {
      const response = _.omit(status, 'meta');
      res.status(500).json({ error: 'Errors reported by Elasticsearch', response });
    }
  } catch (e) {
    const response = _.omit(e, 'meta.meta');
    res.status(500).json({ error: 'Error connecting to ElasticSearch', response });
  }
});

export default healthRouter;
