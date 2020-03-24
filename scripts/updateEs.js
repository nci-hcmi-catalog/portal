const esConfig = require('./esConfig');
const run = async () => {
  await esConfig.updateSearchIndexMapping();
  await esConfig.updateArrangerProject();
};

run();
