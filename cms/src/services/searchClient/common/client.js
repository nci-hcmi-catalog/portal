import { getSearchClient } from '@overture-stack/arranger-server';

const getClient = async () => {
  const eshost = `${process.env.ES_HOST || 'http://localhost'}:${process.env.ES_PORT || 9200}`;
  const client = await getSearchClient({
    node: eshost,
  });
  return client;
};

export default getClient;
