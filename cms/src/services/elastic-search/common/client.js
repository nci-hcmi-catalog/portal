import { Client } from '@opensearch-project/opensearch';
const eshost = `${process.env.ES_HOST || 'http://localhost'}:${process.env.ES_PORT || 9200}`;
const client = new Client({
  node: eshost,
});

export default client;
