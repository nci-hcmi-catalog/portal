import elasticsearch from '@elastic/elasticsearch';

const client = new elasticsearch.Client({
  node: process.env.ES_URL,
});

export default client;
