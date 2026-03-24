import { buildSearchClient } from '@overture-stack/arranger-server';

const getClient = async () => {
  const host =
    process.env.ES_HOST && process.env.ES_PORT
      ? `${process.env.ES_HOST}:${process.env.ES_PORT}`
      : 'http://localhost:9200';
  const user = process.env.ES_USER || '';
  const password = process.env.ES_PASS || '';

  return await buildSearchClient(host, user, password);
};

export default getClient;
