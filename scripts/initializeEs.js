const es = require('@elastic/elasticsearch');

/** Arranger metadatas: **/
const aggsState = require('./arranger_metadata/aggs-state.json');
const columnsState = require('./arranger_metadata/columns-state.json');
const extended = require('./arranger_metadata/extended.json');
const matchboxState = require('./arranger_metadata/matchbox-State.json');

/** Search index settings and mappings **/
const indexSetup = require('./searchIndex.json');
const searchIndex = process.env.ES_INDEX || 'demo';
const arrangerProject = process.env.PROJECT_ID || 'demo';
const esHost = process.env.ES_HOST || 'http://localhost:9200';

const client = new es.Client({
  node: esHost,
});
const date = new Date();

(async () => {
  /** initialize search index */
  console.log(`Creating search index: ${searchIndex}`);
  await client.indices.create({
    index: searchIndex,
    body: indexSetup,
  });
  console.log(`Creating arranger project list: arranger-projects`);
  await client.indices.create({
    index: 'arranger-projects',
  });
  console.log(`Creating arranger project list: ${arrangerProject}`);
  await client.index({
    index: 'arranger-projects',
    body: {
      id: arrangerProject,
      active: true,
      timestamp: date,
    },
  });
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
})();
