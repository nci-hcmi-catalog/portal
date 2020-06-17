const esUtils = require('./esUtils');
const run = async () => {
  await esUtils.updateSearchIndex();
  await esUtils.updateArrangerProject();
};

run();
