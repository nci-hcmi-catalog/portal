const esUtils = require('./utils/esUtils');
const { republishModels } = require('./utils/republishUtils');
const run = async () => {
  await esUtils.deleteSearchIndex();
  await esUtils.createSearchIndex();
  await esUtils.updateArrangerProject();
  await republishModels();
};

run();
