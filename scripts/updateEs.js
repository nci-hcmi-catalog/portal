const esUtils = require('./utils/esUtils');
const run = async () => {
  await esUtils.updateSearchIndices();
};

run();
