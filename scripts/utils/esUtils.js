import es from '@elastic/elasticsearch';

const pm2Path = process.env.CMS_CONFIG || '../../cms/pm2.config.js';
const pm2Env = process.env.ENV;
if (!pm2Env) {
  throw new Error('No ENV value provided!');
}
const pm2Config = await import(pm2Path).then(({ default: config }) => config );
const pm2ConfigGeneric =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0].env) || {};
const pm2ConfigForEnv =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0][`env_${pm2Env}`]) || {};

const pm2 = { ...pm2ConfigGeneric, ...pm2ConfigForEnv };

/** Search index settings and mappings **/
import modelsIndexConfig from '../../elasticsearch/modelsIndex.json' with { type: "json" };
import genesIndexConfig from '../../elasticsearch/genesIndex.json' with { type: "json" };
import variantsIndexConfig from '../../elasticsearch/variantsIndex.json' with { type: "json" };
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
const createModelsIndex = async () =>
  await createIndex(modelsIndexName, modelsIndexConfig);

const deleteModelsIndex = async () => await deleteIndex(modelsIndexName);

/* ******* Genes Index ******** */
const createGenesIndex = async () => await createIndex(GENES_INDEX, genesIndexConfig);

const deleteGenesIndex = async () => await deleteIndex(GENES_INDEX);

/* ******* Variants Index ******** */
const createVariantsIndex = async () =>
  await createIndex(VARIANTS_INDEX, variantsIndexConfig);

const deleteVariantsIndex = async () => await deleteIndex(VARIANTS_INDEX);

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

const updateSearchIndices = async () => {
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

const configureArrangerSets = async () => {
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

const esUtils = {
  config: pm2,
  createModelsIndex,
  deleteModelsIndex,
  createGenesIndex,
  deleteGenesIndex,
  createVariantsIndex,
  deleteVariantsIndex,
  updateSearchIndices,
  configureArrangerSets,
};

export default esUtils;
