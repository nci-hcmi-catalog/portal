import elasticsearch, { Client } from '@opensearch-project/opensearch';

const client: Client = new elasticsearch.Client({
  node: process.env.ES_URL,
});

export default client;
