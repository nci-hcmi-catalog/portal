// @ts-check

import getClient from './common/client.js';
import getLogger from '../../logger.js';
const logger = getLogger('services/searchClient/update');

const index = process.env.ES_UPDATE_INDEX;

const update = async () => {
  const searchClient = await getClient();
  return await searchClient
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

export default update;
