import elasticClient from './common/client';

const index = process.env.ES_INDEX;

export const unpublishOneFromES = id => {
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        term: { _id: id },
      },
    },
  });
};
