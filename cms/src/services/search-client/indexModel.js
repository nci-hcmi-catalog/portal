// @ts-check

import getClient from './client.js';
import getLogger from '../../logger.js';
const logger = getLogger('services/search-client/update');

const index = process.env.ES_INDEX;

const indexModel = async (id, model) => {
  const searchClient = await getClient();
  return searchClient
    .index({
      index,
      id,
      body: {
        ...model,
      },
    })
    .catch((error) => {
      logger.error(error, index, `Error indexing Model data`);
      throw error;
    });
};

export default indexModel;
