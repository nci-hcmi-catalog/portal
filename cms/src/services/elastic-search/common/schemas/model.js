import mongoose from 'mongoose';
import mongooseElasticsearch from 'mongoose-elasticsearch-xp';
import { ModelSchema } from '../../../../schemas/model';
import elasticClient from '../client';

const index = process.env.ES_INDEX;

ModelSchema.plugin(mongooseElasticsearch.v7, {
  client: elasticClient,
  index,
  type: '_doc',
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
