import mongoose from 'mongoose';

import mongooseElasticsearch from 'mongoose-elasticsearch-xp';
import elasticClient from '../client';

const GeneSchema = new mongoose.Schema(
  {
    _gene_id: { type: String, unique: true, required: true, es_indexed: true },
    symbol: { type: String, unique: true, required: true, es_indexed: true },
    ensemble_id: { type: String, unique: true, required: true, es_indexed: true },
    name: { type: String, es_indexed: true },
    synonyms: { type: [String], es_indexewd: true },
    biotype: { type: String, es_indexed: false },
  },
  {
    collection: 'genesReference',
  },
);

GeneSchema.plugin(mongooseElasticsearch.v7, {
  client: elasticClient,
  index: 'genes',
  type: '_doc',
});

export const GeneSchemaES = mongoose.model('Gene', GeneSchema);
