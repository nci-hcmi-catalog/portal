// @ts-check
import getLogger from '../../logger.js';
import pm2 from '../../pm2.js';

import getClient from './client.js';

const logger = getLogger('services/search-client/update');

const index = pm2.ES_INDEX || process.env.ES_UPDATE_INDEX || 'hcmi-update';

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
