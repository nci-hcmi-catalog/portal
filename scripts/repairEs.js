import esUtils from './utils/esUtils.js';
import { republishModels } from './utils/republishUtils.js';
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
