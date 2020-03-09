// @ts-check

import elasticClient from './common/client';

const index = process.env.ES_UPDATE_INDEX;

export default () =>
  elasticClient
    .index({
      index,
      type: index,
      body: {
        date: Date.now(),
      },
    })
    .catch(err =>
      // Catch here as we do not want an error here to block execution of the app
      console.error(
        `Error creating a new update in the ${index} index: ${err ||
          'Unknown error has occurred.'}`,
      ),
    );
