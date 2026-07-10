// @ts-check
import { pm2 } from '../../index.js';
import getLogger from '../../logger.js';

import getClient from './client.js';

const logger = getLogger('services/search-client/update');

const index = process.env.ES_UPDATE_INDEX || 'hcmi-update';

const indexLastUpdated = async () => {
  const searchClient = getClient(pm2);
  return searchClient
    .index({
      index,
      body: {
        date: Date.now(),
      },
    })
    .catch((error) =>
      // Catch here as we do not want an error here to block execution of the app
      logger.error(error, index, `Error creating a new update for index`),
    );
};

export default indexLastUpdated;
