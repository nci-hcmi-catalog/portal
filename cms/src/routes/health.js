import express from 'express';
import _ from 'lodash';

import client from '../services/elastic-search/common/client';
import Model from '../schemas/model';
import { testS3Connection } from '../services/s3';

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

healthRouter.get('/s3', async (req, res) => {
  try {
    await testS3Connection()
      .then(data =>
        res
          .status(200)
          .json({ status: 200, response: `Connected to S3 successfully: ${JSON.stringify(data)}` }),
      )
      .catch(err =>
        res.status(err.statusCode).json({ error: 'Error connecting to S3', response: err.code }),
      );
  } catch (e) {
    res.status(500).json({ error: 'Error connecting to S3', response: e });
  }
});

export default healthRouter;
