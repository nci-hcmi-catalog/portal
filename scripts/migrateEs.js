const es = require('@elastic/elasticsearch');

/** Arranger metadatas: **/
const aggsState = require('./arranger_metadata/aggs-state.json');
const columnsState = require('./arranger_metadata/columns-state.json');
const extended = require('./arranger_metadata/extended.json');
const matchboxState = require('./arranger_metadata/matchbox-state.json');
const indexMapping = require('./arranger_metadata/project-mapping.json');

/** Search index settings and mappings **/
const indexSetup = require('./searchIndex.json');
const searchIndex = process.env.ES_INDEX || 'hcmi';
const arrangerProject = process.env.PROJECT_ID || 'hcmi';
const esHost = process.env.ES_HOST || 'http://localhost:9200';

const client = new es.Client({
  node: esHost,
});
const date = new Date();

client.indices.close({
  index: 'hcmi',
});
