import { buildSearchClient } from '@overture-stack/arranger-graphql-router';

import { pm2 } from '../index.ts';

const getClient = async () => {
  const node = process.env.ES_URL || pm2.ES_URL || 'http://localhost:9201';
  const username = process.env.ES_USER || pm2.ES_USER || '';
  const password = process.env.ES_PASS || pm2.ES_PASS || '';
  const client = process.env.SEARCH_CLIENT_TYPE || pm2.SEARCH_CLIENT_TYPE || 'opensearch';

  return await buildSearchClient({ node, username, password, client });
};

export default getClient;
