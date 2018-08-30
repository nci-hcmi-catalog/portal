import elasticClient from './common/client';

const index = process.env.ES_INDEX;

export const unpublishOneFromES = name => {
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        term: { name },
      },
    },
  });
};
