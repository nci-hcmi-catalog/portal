const es = require('@elastic/elasticsearch');

const pm2Path = process.env.CMS_CONFIG || '../../cms/pm2.config.js';
const pm2Env = process.env.ENV;
if (!pm2Env) {
  throw new Error('No ENV value provided!');
}
const pm2Config = require(pm2Path);
const pm2ConfigGeneric =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0].env) || {};
const pm2ConfigForEnv =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0][`env_${pm2Env}`]) || {};

const pm2 = { ...pm2ConfigGeneric, ...pm2ConfigForEnv };

module.exports.config = pm2;

/** Search index settings and mappings **/
const modelsIndexConfig = require('../../elasticsearch/modelsIndex.json');
const genesIndexConfig = require('../../elasticsearch/genesIndex.json');
const variantsIndexConfig = require('../../elasticsearch/variantsIndex.json');
const modelsIndexName = process.env.ES_INDEX || pm2.ES_INDEX || 'hcmi';
const esHost = process.env.ES_HOST || `${pm2.ES_HOST}:${pm2.ES_PORT}`;

const GENES_INDEX = 'genes';
const VARIANTS_INDEX = 'genomic_variants';

const client = new es.Client({
  node: esHost,
});

/* ******** Index creation and deletion ******** */
const createIndex = async (index, config) => {
  try {
    console.log(`\nCreating index: ${index}`);
    await client.indices.create({
      index,
      body: config,
    });
    console.log('Success! Created index:', index);
  } catch (e) {
    console.log('Unable to create index:', index);
    console.log(e);
    console.log(JSON.stringify(e.meta));
  }
};

const deleteIndex = async index => {
  try {
    console.log(`\nDeleting existing index (if present): ${index}`);
    await client.indices.delete({ index });
  } catch (e) {}
};

/* ******* Models Index ******** */
module.exports.createModelsIndex = async () =>
  await createIndex(modelsIndexName, modelsIndexConfig);

module.exports.deleteModelsIndex = async () => await deleteIndex(modelsIndexName);

/* ******* Genes Index ******** */
module.exports.createGenesIndex = async () => await createIndex(GENES_INDEX, genesIndexConfig);

module.exports.deleteGenesIndex = async () => await deleteIndex(GENES_INDEX);

/* ******* Variants Index ******** */
module.exports.createVariantsIndex = async () =>
  await createIndex(VARIANTS_INDEX, variantsIndexConfig);

module.exports.deleteVariantsIndex = async () => await deleteIndex(VARIANTS_INDEX);

/* ******** Update Indicies ******** */
const updateIndex = async ({ index, settings = {}, mappings = {} } = {}) => {
  try {
    console.log('Updating mapping for:', index);
    await client.indices.close({
      index,
    });

    await client.indices.putSettings({ index, body: settings });
    await client.indices.putMapping({ index, body: mappings });

    await client.indices.open({
      index,
    });
    console.log('Success! Updated mapping for:', index);
  } catch (e) {
    console.log('Unable to update index mapping for', index);
    console.log(e);
  }
};

module.exports.updateSearchIndices = async () => {
  await updateIndex({
    index: modelsIndexName,
    settings: modelsIndexConfig.settings,
    mapping: modelsIndexConfig.mapping,
  });
  await updateIndex({
    index: GENES_INDEX,
    settings: genesIndexConfig.settings,
    mapping: genesIndexConfig.mapping,
  });
  await updateIndex({
    index: VARIANTS_INDEX,
    settings: variantsIndexConfig.settings,
    mapping: variantsIndexConfig.mapping,
  });
};

module.exports.configureArrangerSets = async () => {
  try {
    console.log(`\nDeleting existing index (if present): arranger-sets`);
    await client.indices.delete({ index: `arranger-sets` });
  } catch (e) {}
  try {
    console.log(`Creating index: arranger-sets`);
    await client.indices.create({
      index: 'arranger-sets',
      body: {
        mappings: {
          properties: {
            setId: {
              type: 'keyword',
            },
            sqon: {
              type: 'object',
            },
            ids: {
              type: 'keyword',
            },
            type: {
              type: 'keyword',
            },
            path: {
              type: 'keyword',
            },
            size: {
              type: 'long',
            },
            createdAt: {
              type: 'date',
            },
          },
        },
      },
    });
    console.log('Success! Created arranger-sets');
  } catch (e) {
    console.log('Unable to create:', 'arranger-sets');
    console.log(e);
  }
};
