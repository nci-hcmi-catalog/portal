// @ts-check

import express from 'express';
import getClient from './services/searchClient.ts';

const lastUpdatedRouter = express.Router();

lastUpdatedRouter.get('/', async (req, res) => {
  const searchClient = await getClient();
  try {
    const response = await searchClient.search({
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
    return res.json(response.body.hits.hits[0]._source);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

export default lastUpdatedRouter;
