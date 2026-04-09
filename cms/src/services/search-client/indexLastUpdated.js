// @ts-check

import getClient from './client.js';
import getLogger from '../../logger.js';
const logger = getLogger('services/search-client/update');

const index = process.env.ES_UPDATE_INDEX || 'hcmi-update';

const indexLastUpdated = async () => {
  const searchClient = await getClient();
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
