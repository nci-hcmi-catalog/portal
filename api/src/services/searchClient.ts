import { buildSearchClient } from '@overture-stack/arranger-server';

const getClient = async () => {
  const node = process.env.ES_URL || 'http://localhost:9200';
  const user = process.env.ES_USER || '';
  const password = process.env.ES_PASS || '';
  const client = process.env.SEARCH_CLIENT_TYPE || 'opensearch';

  return await buildSearchClient({ node, user, password, client });
};

export default getClient;
