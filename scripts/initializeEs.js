const esConfig = require('./esConfig');
const run = async () => {
  /** initialize search index */
  await esConfig.createSearchIndex();
  await esConfig.createArrangerProjectList();
  await esConfig.createArrangerProject();
  await esConfig.configureArrangerSets();
};

run();
