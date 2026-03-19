import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

import { ModelSchema } from '../../../../schemas/model.js';
import getClient from '../client.js';

const index = process.env.ES_INDEX;

ModelSchema.plugin(mongoosastic, {
  esClient: await getClient(),
  index,
});

export const ModelES = mongoose.model('ModelES', ModelSchema);
