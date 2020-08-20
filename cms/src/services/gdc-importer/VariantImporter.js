import Model from '../../schemas/model';
import { findMafUrl } from './mafFiles';

const ImportStatus = {
  active: 'ACTIVE',
  stopped: 'STOPPED',
  complete: 'COMPLETE',
  error: 'ERROR',
};

const Import = function(modelName, fileUrl) {
  const startTime = Date.now();

  let stopTime = null;

  let status = ImportStatus.active;
  let errors = [];
  let acknowledged = false;

  const stop = () => {
    status = ImportStatus.stopped;
    stopTime = Date.now();
  };

  const acknowledge = () => {
    acknowledged = true;
  };

  const getStatus = () => status;
  const getErrors = () => errors;

  const getData = () => ({ status, errors, startTime, stopTime, acknowledged });

  return { modelName, getData, stop, acknowledge };
};

const VariantImporter = (function() {
  let imports = [];

  const summarizeImport = item => {
    const data = item.getData();
    return {
      startTime: data.startTime,
      stopTime: data.stopTime,
      status: data.status,
      errors: data.errors,
      name: item.modelName,
    };
  };

  const cleanImportsList = () => {
    imports = imports.filter(i => {
      const data = i.getData();

      const stopped = ImportStatus.stopped === data.status;
      const acknowledgedError = ImportStatus.error === data.status && data.acknowledged;
      const acknowledgedComplete = ImportStatus.complete === data.status && data.acknowledged;

      return !(stopped || acknowledgedError || acknowledgedComplete);
    });

    imports;
  };

  const startImport = async modelName => {
    // check for Model existence:
    const model = await Model.findOne({ name: modelName });
    if (!model) {
      return { error: `No model with name: ${modelName}` };
    }

    // Make sure we don't have duplicate imports running.
    stopImport(modelName);

    try {
      const fileUrl = await findMafUrl(modelName);
    } catch (e) {
      console.log('Error occurred while fetching MAF file URL from GDC');
      console.log(e);
      return { error: 'Communication error occurred with GDC.' };
    }

    const result = Import(modelName, fileUrl);
    imports.push(result);

    return summarizeImport(result);
  };

  const stopImport = async modelName => {
    // In case we get into an invalid state with multiple imports for a given model name,
    //   we'll use filter to get the whole list of them.
    const targets = imports.filter(i => i.modelName === modelName);
    if (targets.length) {
      targets.forEach(target => target.stop());
    }

    cleanImportsList();

    return targets.map(summarizeImport);
  };

  const getImports = () => {
    cleanImportsList();

    return imports.map(summarizeImport);
  };

  const acknowledgeCompleted = modelName => {
    const targets = imports.filter(
      i =>
        i.modelName === modelName &&
        [ImportStatus.complete, ImportStatus.error].includes(i.getData().status),
    );
    if (targets.length) {
      targets.forEach(target => target.acknowledge());
    }

    cleanImportsList();

    return imports.map(summarizeImport);
  };

  return {
    startImport,
    stopImport,
    getImports,
    acknowledgeCompleted,
  };
})();

export default VariantImporter;
