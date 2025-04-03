// @ts-check

import elasticClient from './common/client';
import getLogger from '../../logger';
const logger = getLogger('services/elastic-search/update');

const index = process.env.ES_UPDATE_INDEX;

const update = () =>
  elasticClient
    .index({
      index,
      type: index,
      body: {
        date: Date.now(),
      },
    })
    .catch(error =>
      // Catch here as we do not want an error here to block execution of the app
      logger.error(error, index, `Error creating a new update for index`),
    );

export default update;
