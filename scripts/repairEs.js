const esUtils = require('./utils/esUtils');
const { republishModels } = require('./utils/republishUtils');
const run = async () => {
  await esUtils.deleteModelsIndex();
  await esUtils.createModelsIndex();

  await esUtils.deleteGenesIndex();
  await esUtils.createGenesIndex();

  await esUtils.deleteVariantsIndex();
  await esUtils.createVariantsIndex();

  await republishModels();
};

run();
