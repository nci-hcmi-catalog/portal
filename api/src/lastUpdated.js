// @ts-check

import express from 'express';
import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: process.env.ES_URL,
});

const lastUpdatedRouter = express.Router();

lastUpdatedRouter.get('/', async (req, res) => {
  try {
    const response = await client.search({
      index: process.env.ES_UPDATE_INDEX,
      body: {
        query: {
          match_all: {},
        },
        size: 1,
        sort: [
          {
            date: {
              order: 'desc',
            },
          },
        ],
      },
    });
    return res.json(response.hits.hits[0]._source);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

export default lastUpdatedRouter;
