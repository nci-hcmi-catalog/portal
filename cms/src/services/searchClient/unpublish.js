// @ts-check

import getClient from './common/client.js';
import indexEsUpdate from './update.js';
import Model from '../../schemas/model.js';
import { indexMatchedModelsToES } from './publish.js';
import { modelStatus } from '../../helpers/modelStatus.js';
import { updateGeneSearchIndicies } from './genomicVariants.js';

import getLogger from '../../logger.js';
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
  await indexEsUpdate();
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
  await indexEsUpdate();
  const searchClient = await getClient();
  return searchClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
