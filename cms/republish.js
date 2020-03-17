require('babel-polyfill');
require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/env'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
  ],
});
const mongoose = require('mongoose');
const Model = require('./src/schemas/model');
const { ModelES } = require('./src/services/elastic-search/common/schemas/model');

const { modelStatus } = require('./src/helpers/modelStatus');

const { indexOneToES } = require('./src/services/elastic-search/publish.js');
const indexEsUpdate = require('./src/services/elastic-search/update.js');

const run = async () => {
  console.log('Connecting to MongoDB...');
  // Connect to database

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
    useNewUrlParser: true,
  });
  console.log('Connected!');

  const models = await ModelES.find({
    status: { $in: [modelStatus.published, modelStatus.unpublishedChanges] },
  });

  console.log('\nSearching for models to publish...');
  const names = models.map(i => i.name);
  console.log('Found the following published models:\n', names);
  for (const model of models) {
    console.log('Publishing:', model.name);
    await new Promise(resolve => model.esIndex(() => resolve()));

    // Mark all models as published (no more published with changes)
    model.status = modelStatus.published;
    await model.save();
  }

  indexEsUpdate.default();

  mongoose.disconnect();
};

run();
