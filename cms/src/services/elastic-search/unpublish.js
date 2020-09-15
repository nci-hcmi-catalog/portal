// @ts-check

import elasticClient from './common/client';
import indexEsUpdate from './update';
import Model from '../../schemas/model';
import { indexMatchedModelsToES } from './publish';
import { modelStatus } from '../../helpers/modelStatus';
import { updateGeneSearchIndicies } from './genomicVariants';

import getLogger from '../../logger';
const logger = getLogger('services/elastic-search/unpublish');

const index = process.env.ES_INDEX;

export const unpublishModel = async name => {
  await unpublishOneFromES(name);
  await indexMatchedModelsToES({ name });
  updateGeneSearchIndicies();
};

export const unpublishOneFromES = async name => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
  await elasticClient.deleteByQuery({
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
  logger.audit({ model: name }, 'unpublish model', 'Model Unpublished from ES');
};

export const unpublishManyFromES = nameArr => {
  // Not waiting for update promise to
  // resolve as this is just bookkeeping
  indexEsUpdate();
  return elasticClient.deleteByQuery({
    index,
    body: {
      query: {
        terms: { name: nameArr },
      },
    },
  });
};
