import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

import { ModelSchema } from '../../../../schemas/model.js';
import getSearchClient from '../client.js';

const index = process.env.ES_INDEX;

ModelSchema.plugin(mongoosastic, {
  esClient: getSearchClient(),
  index,
  type: '_doc',
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
