// @ts-check

import Model from '../../schemas/model.js';
import { modelStatus } from '../../helpers/modelStatus.js';
import getLogger from '../../logger.js';

import getClient from './client.js';
import indexLastUpdated from './indexLastUpdated.js';
import { indexMatchedModelsToES } from './publish.js';
import { updateGeneSearchIndicies } from './genomicVariants.js';

const logger = getLogger('services/searchClient/unpublish');

const index = process.env.ES_INDEX;

export const unpublishModel = async (name) => {
  await unpublishOneFromES(name);
  await indexMatchedModelsToES({ name });
  await updateGeneSearchIndicies();
};

export const unpublishOneFromES = async (name) => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  await indexLastUpdated();
  const searchClient = await getClient();
  await searchClient.deleteByQuery({
    index,
    body: {
      query: {
        term: { name },
      },
    },
  });
  await Model.updateOne(
    {
      name,
    },
    { status: modelStatus.unpublished },
  );
  logger.info({ model: name }, 'unpublish model', 'Model Unpublished from ES');
};

export const unpublishManyFromES = async (nameArr) => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  await indexLastUpdated();
  const searchClient = await getClient();
  return await searchClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
