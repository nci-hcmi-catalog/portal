const esUtils = require('./utils/esUtils');
const run = async () => {
  /** initialize search index */
  await esUtils.createModelsIndex();

  await esUtils.createArrangerProjectList();
  await esUtils.createArrangerProject();
  await esUtils.configureArrangerSets();

  await esUtils.createGenesIndex();
  await esUtils.createVariantsIndex();
};

run();
