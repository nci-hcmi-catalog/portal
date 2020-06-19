const es = require('@elastic/elasticsearch');

/** Arranger metadatas: **/
const aggsState = require('./arranger_metadata/aggs-state.json');
const columnsState = require('./arranger_metadata/columns-state.json');
const extended = require('./arranger_metadata/extended.json');
const matchboxState = require('./arranger_metadata/matchbox-state.json');

const pm2Path = process.env.CMS_CONFIG || '../cms/pm2.config.js';
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
const indexSetup = require('./searchIndex.json');
const searchIndex = process.env.ES_INDEX || pm2.ES_INDEX || 'hcmi';
const arrangerProject = process.env.PROJECT_ID || pm2.ES_INDEX || 'hcmi';
const esHost = process.env.ES_HOST || `${pm2.ES_HOST}:${pm2.ES_PORT}`;

const client = new es.Client({
  node: esHost,
});
const date = new Date();

const createSearchIndex = async () => {
  try {
    console.log(`\nCreating search index: ${searchIndex}`);
    await client.indices.create({
      index: searchIndex,
      body: indexSetup,
    });
    console.log('Success! Created index:', searchIndex);
  } catch (e) {
    console.log('Unable to create index:', searchIndex);
    console.log(e);
  }
};

module.exports.createSearchIndex = createSearchIndex;

module.exports.deleteSearchIndex = async () => {
  try {
    console.log(`\nDeleting existing index (if present): ${arrangerProject}`);
    await client.indices.delete({ index: `${arrangerProject}` });
  } catch (e) {}
};

module.exports.updateSearchIndex = async () => {
  try {
    await client.indices.close({
      index: searchIndex,
    });

    await client.indices.putSettings({ index: searchIndex, body: indexSetup.settings });
    await client.indices.putMapping({ index: searchIndex, body: indexSetup.mappings });

    await client.indices.open({
      index: searchIndex,
    });
    console.log('Success! Updated mapping for:', searchIndex);
  } catch (e) {
    console.log('Unable to update index mapping for', searchIndex);
    console.log(e);
  }
};

module.exports.createArrangerProjectList = async () => {
  try {
    console.log(`\nCreating arranger project list: arranger-projects`);
    await client.indices.create({
      index: 'arranger-projects',
    });
    console.log(`\nAdding project to arranger project list: ${arrangerProject}`);
    await client.index({
      index: 'arranger-projects',
      body: {
        id: arrangerProject,
        active: true,
        timestamp: date,
      },
    });
    console.log('Success! Created arranger-projects and added project:', arrangerProject);
  } catch (e) {
    console.log('Unable to initialize arranger-projects');
    console.log(e);
  }
};

const createArrangerProject = async () => {
  const projectIndex = `arranger-projects-${arrangerProject}`;
  try {
    console.log(`\nCreating arranger project: ${arrangerProject}`);
    await client.indices.create({
      index: projectIndex,
    });
    await client.index({
      index: projectIndex,
      body: {
        index: searchIndex,
        name: 'models',
        timestamp: date,
        active: true,
        config: {
          'aggs-state': {
            timestamp: date,
            state: aggsState,
          },
          'columns-state': {
            timestamp: date,
            state: columnsState,
          },
          'matchbox-state': {
            timestamp: date,
            state: matchboxState,
          },
          extended: extended,
        },
      },
    });
    console.log('Success! Created and configured project index:', arrangerProject);
  } catch (e) {
    console.log('Unable to set up project meta data:', projectIndex);
    console.log(e);
  }
};

module.exports.createArrangerProject = createArrangerProject;

module.exports.updateArrangerProject = async () => {
  try {
    console.log(`\nDeleting existing index (if present): arranger-projects-${arrangerProject}`);
    await client.indices.delete({ index: `arranger-projects-${arrangerProject}` });
  } catch (e) {}
  await createArrangerProject();
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
