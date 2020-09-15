const { republishModels } = require('./utils/republishUtils');

const run = async () => {
  await republishModels();
};

run();
