const es = require('@elastic/elasticsearch');

/** Arranger metadatas: **/
const aggsState = require('./arranger_metadata/aggs-state.json');
const columnsState = require('./arranger_metadata/columns-state.json');
const extended = require('./arranger_metadata/extended.json');
const matchboxState = require('./arranger_metadata/matchbox-state.json');

/** Search index settings and mappings **/
const indexSetup = require('./searchIndex.json');
const searchIndex = process.env.ES_INDEX || 'hcmi';
const arrangerProject = process.env.PROJECT_ID || 'hcmi';
const esHost = process.env.ES_HOST || 'http://localhost:9200';

const client = new es.Client({
  node: esHost,
});
const date = new Date();

module.exports.createSearchIndex = async () => {
  console.log(`Creating search index: ${searchIndex}`);
  await client.indices.create({
    index: searchIndex,
    body: indexSetup,
  });
};

module.exports.updateSearchIndexMapping = async () => {
  await client.indices.close({
    index: searchIndex,
  });

  await client.indices.putMapping({ index: searchIndex, body: indexSetup.mappings });

  await client.indices.open({
    index: searchIndex,
  });
};

module.exports.createArrangerProjectList = async () => {
  console.log(`Creating arranger project list: arranger-projects`);
  try {
    await client.indices.create({
      index: 'arranger-projects',
    });
  } catch (err) {
    console.log(`failed to create arranger-projects index: ${err}`);
  }
  console.log(`Adding project to arranger project list: ${arrangerProject}`);
  await client.index({
    index: 'arranger-projects',
    body: {
      id: arrangerProject,
      active: true,
      timestamp: date,
    },
  });
};

const createArrangerProject = async () => {
  console.log(`Creating arranger project: ${arrangerProject}`);
  await client.indices.create({
    index: `arranger-projects-${arrangerProject}`,
  });
  await client.index({
    index: `arranger-projects-${arrangerProject}`,
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
};

module.exports.createArrangerProject = createArrangerProject;

module.exports.updateArrangerProject = async () => {
  try {
    console.log(`Deleting existing index (if present): arranger-projects-${arrangerProject}`);
    await client.indices.delete({ index: `arranger-projects-${arrangerProject}` });
  } catch (e) {}
  await createArrangerProject();
};
