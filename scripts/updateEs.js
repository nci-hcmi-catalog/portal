import esUtils from './utils/esUtils.js';
const run = async () => {
  await esUtils.updateSearchIndices();
};

run();
