import esUtils from './utils/esUtils.js';

const run = async () => {
  const {
    createLastUpdatedIndex,
    createModelsIndex,
    configureArrangerSets,
    createGenesIndex,
    createVariantsIndex,
  } = esUtils;

  /** initialize search index */
  await createLastUpdatedIndex();
  await createModelsIndex();
  await configureArrangerSets();
  await createGenesIndex();
  await createVariantsIndex();
};

run();
