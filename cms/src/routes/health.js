import express from 'express';
import _ from 'lodash';

import client from '../services/elastic-search/common/client';
import Model from '../schemas/model';

const startTime = Date.now();

const healthRouter = express.Router();

healthRouter.get('/', async (req, res) => {
  const uptime = Date.now() - startTime;
  res.status(200).json({ status: 'ok', startTime, uptime });
});

healthRouter.get('/es', async (req, res) => {
  try {
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

healthRouter.get('/db', async (req, res) => {
  try {
    const response = await Model.countDocuments();
    res.status(200).json({ status: 200, models: response });
  } catch (e) {
    res.status(500).json({ error: 'Error reading from DB', response: e });
  }
});

export default healthRouter;
