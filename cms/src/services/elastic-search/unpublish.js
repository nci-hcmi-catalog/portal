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

export const unpublishManyFromES = nameArr => {
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
