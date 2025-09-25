import mongoose from 'mongoose';
import mongooseElasticsearch from 'mongoose-elasticsearch-xp';
import { ModelSchema } from '../../../../schemas/model.js';
import elasticClient from '../client.js';

const index = process.env.ES_INDEX;

ModelSchema.plugin(mongooseElasticsearch.v7, {
  client: elasticClient,
  index,
  type: '_doc',
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
