// @ts-check

import express from 'express';

const dataExportRouter = express.Router();

dataExportRouter.get('/', async (req, res) => {
  try {
    const response = {};
    return res.json(response.hits.hits[0]._source);
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

export default dataExportRouter;
