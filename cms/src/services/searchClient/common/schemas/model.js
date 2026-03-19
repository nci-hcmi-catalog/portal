import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

import { ModelSchema } from '../../../../schemas/model.js';
import elasticClient from '../client.js';

const index = process.env.ES_INDEX;

ModelSchema.plugin(mongoosastic, {
  client: elasticClient,
  index,
  type: '_doc',
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
