// @ts-check
import getLogger from '../../logger.js';
import pm2 from '../../pm2.js';

import getClient from './client.js';

const logger = getLogger('services/search-client/update');

const index = process.env.ES_INDEX || 'hcmi';

const indexModel = async (id, model) => {
  const searchClient = getClient(pm2);
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
