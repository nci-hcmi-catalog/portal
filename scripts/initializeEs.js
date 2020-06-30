const esUtils = require('./utils/esUtils');
const run = async () => {
  /** initialize search index */
  await esUtils.createSearchIndex();
  await esUtils.createArrangerProjectList();
  await esUtils.createArrangerProject();
  await esUtils.configureArrangerSets();
};

run();
