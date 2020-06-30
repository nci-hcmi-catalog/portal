const esUtils = require('./utils/esUtils');
const run = async () => {
  await esUtils.updateSearchIndex();
  await esUtils.updateArrangerProject();
};

run();
