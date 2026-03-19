import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

import elasticClient from '../services/searchClient/common/client.js';

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

GeneSchema.plugin(mongoosastic, {
  client: elasticClient,
  index: 'genes',
  type: '_doc',
});

export default mongoose.model('Gene', GeneSchema);
