import esUtils from './utils/esUtils.js';

const run = async () => {
  /** initialize search index */
  await esUtils.createModelsIndex();
  await esUtils.configureArrangerSets();

  await esUtils.createGenesIndex();
  await esUtils.createVariantsIndex();
};

run();
