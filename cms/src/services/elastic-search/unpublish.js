// @ts-check

import elasticClient from './common/client';
import indexEsUpdate from './update';

const index = process.env.ES_INDEX;

export const unpublishOneFromES = name => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
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
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
