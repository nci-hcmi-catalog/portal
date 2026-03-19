// @ts-check

import getClient from './common/client.js';
import getLogger from '../../logger.js';
const logger = getLogger('services/searchClient/update');

const index = process.env.ES_INDEX;

const indexModel = async (model) => {
  const searchClient = await getClient();
  console.log('model for index', model);
  return searchClient
    .index({
      index,
      body: {
        ...model,
      },
    })
    .catch((error) =>
      // Catch here as we do not want an error here to block execution of the app
      logger.error(error, index, `Error indexing Model data`),
    );
};

export default indexModel;
