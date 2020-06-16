const esUtils = require('./esConfig');
const run = async () => {
  await esUtils.updateSearchIndexMapping();
  await esUtils.updateArrangerProject();
};

run();
