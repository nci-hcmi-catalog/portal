import { buildSearchClient } from '@overture-stack/arranger-server';

const getClient = async () => {
  const node = process.env.ES_URL || 'http://localhost:9200';
  const user = process.env.ES_USER || '';
  const password = process.env.ES_PASS || '';
  return await buildSearchClient({ node, user, password });
};

export default getClient;
