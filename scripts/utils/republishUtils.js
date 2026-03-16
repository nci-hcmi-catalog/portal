import esUtils from './esUtils.js';

// Do some env setup to simulate using pm2 as an env import (amazing hack!)
process.env = esUtils.config;

import 'babel-polyfill';
import mongoose from 'mongoose';
import { publishModel } from '../../cms/src/services/searchClient/publish.js';
import { ModelES } from '../../cms/src/services/searchClient/common/schemas/model.js';
import '../../cms/src/schemas/variant.js';
import '../../cms/src/schemas/matchedModels.js';

import { modelStatus } from '../../cms/src/helpers/modelStatus.js';

import indexEsUpdate from '../../cms/src/services/searchClient/update.js';

export const republishModels = async () => {
  console.log('Connecting to MongoDB...');
  // Connect to database

  await mongoose.connect(esUtils.config.MONGODB_URI);
  console.log('\nConnected!');

  const models = await ModelES.find({
    status: { $in: [modelStatus.published, modelStatus.unpublishedChanges] },
  });

  console.log('\nSearching for models to publish...');
  const names = models.map((i) => i.name);
  console.log('Found the following published models:\n', names);
  for (const model of models) {
    console.log('Publishing:', model.name);
    await publishModel({ name: model.name });
  }

  indexEsUpdate();

  mongoose.disconnect();
};
