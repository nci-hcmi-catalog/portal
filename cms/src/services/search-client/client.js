import { buildSearchClient } from '@overture-stack/arranger-graphql-router';

const getClient = async (pm2config) => {
  const nodeConfig = pm2config?.node;
  const node = nodeConfig
    ? nodeConfig
    : process.env.ES_HOST && process.env.ES_PORT
    ? `${process.env.ES_HOST}:${process.env.ES_PORT}`
    : 'http://localhost:9200';
  const username = pm2config?.user || process.env.ES_USER || '';
  const password = pm2config?.password || process.env.ES_PASS || '';
  const client = pm2config?.clientType || process.env.SEARCH_CLIENT_TYPE || 'opensearch';

  return await buildSearchClient({ node, username, password, client });
};

export default getClient;
