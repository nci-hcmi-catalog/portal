import { getSearchClient } from '@overture-stack/arranger-server';

const getClient = async () =>
  await getSearchClient({
    node: process.env.ES_URL || 'http://localhost:9200',
  });

export default getClient;
