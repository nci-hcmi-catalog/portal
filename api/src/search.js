import express from 'express';
import esClient from './services/elasticsearch';
import { get, trim } from 'lodash';

const GENES_INDEX = 'genes';
const VARIANTS_INDEX = 'genomic_variants';

const geneSearchRouter = express.Router();

const removeTroubleChars = input => {
  return input.replace(/[}"]/g, '');
};

geneSearchRouter.get('/gene', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      console.log('Could not search genes, invalid query term provided:', q);
      res.status(400).send(`Could not search genes, no query term provided.`);
      return;
    }
    const query = {
      match: {
        search: {
          query: removeTroubleChars(q),
          operator: 'and',
        },
      },
    };

    const response = await esClient.search({
      index: GENES_INDEX,
      body: { query },
    });
    const genes = get(response, 'body.hits.hits', []).map(i => i._source);
    res.status(200).json({ genes });
  } catch (err) {
    console.log('Failure performing gene search:', err);
    res.status(400).send(err.message || err.details || 'An unknown error occurred.');
  }
});

geneSearchRouter.get('/variant', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      console.log('Could not search genomic variants, no query term provided:', q);
      res.status(400).send(`Could not search genomic variants, no query term provided.`);
      return;
    }
    const query = {
      match: {
        search: {
          query: removeTroubleChars(q),
          operator: 'and',
        },
      },
    };

    const response = await esClient.search({
      index: VARIANTS_INDEX,
      body: { query },
    });
    const genes = get(response, 'body.hits.hits', []).map(i => i._source);
    res.status(200).json({ genes });
  } catch (err) {
    console.log('Failure performing genomic variants search:', err);
    res.status(500).send(err.message || err.details || 'An unknown error occurred.');
  }
});

export default geneSearchRouter;
