import mongoose from 'mongoose';
import mongooseElasticsearch from 'mongoose-elasticsearch-xp';
import { ModelSchema } from '../../../../schemas/model';
import elasticClient from '../client';

const index = process.env.ES_INDEX;
const type = process.env.ES_TYPE;

ModelSchema.plugin(mongooseElasticsearch, {
  client: elasticClient,
  index,
  type,
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
