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

(async () => {
  /** initialize search index */
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

  const projectIndex = `arranger-projects-${arrangerProject}`;
  try {
    console.log(`\nCreating arranger project metadata: ${arrangerProject}`);
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

  try {
    console.log(`\nCreating index: arranger-sets`);
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
})();
