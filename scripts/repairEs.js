const esUtils = require('./esUtils');
const { republishModels } = require('./republishUtils');
const run = async () => {
  await esUtils.deleteSearchIndex();
  await esUtils.createSearchIndex();
  await esUtils.updateArrangerProject();
  await republishModels();
};

run();
