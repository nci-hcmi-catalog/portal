import elasticClient from './common/client';

export const unpublishOneFromES = (id, index) => {
  return elasticClient.deleteByQuery({
    index,
    q: id,
  });
};
