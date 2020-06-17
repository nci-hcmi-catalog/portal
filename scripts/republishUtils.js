const esUtils = require('./esUtils');

// Do some env setup to simulate using pm2 as an env import (amazing hack!)
process.env = esUtils.config;

require('babel-polyfill');
require('@babel/register')({
  presets: ['@babel/env'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
  ],
});
const mongoose = require('mongoose');
const { publishModel } = require('../cms/src/services/elastic-search/publish');
const { ModelES } = require('../cms/src/services/elastic-search/common/schemas/model');
require('../cms/src/schemas/variant');
require('../cms/src/schemas/matchedModels');

const { modelStatus } = require('../cms/src/helpers/modelStatus');

const indexEsUpdate = require('../cms/src/services/elastic-search/update.js');

module.exports.republishModels = async () => {
  console.log('Connecting to MongoDB...');
  // Connect to database

  await mongoose.connect(esUtils.config.MONGODB_URI, {
    useNewUrlParser: true,
  });
  console.log('\nConnected!');

  const models = await ModelES.find({
    status: { $in: [modelStatus.published, modelStatus.unpublishedChanges] },
  });

  console.log('\nSearching for models to publish...');
  const names = models.map(i => i.name);
  console.log('Found the following published models:\n', names);
  for (const model of models) {
    console.log('Publishing:', model.name);
    await publishModel({ name: model.name });
  }

  indexEsUpdate.default();

  mongoose.disconnect();
};
