import { ModelES } from './es/schemas/model';

export const indexOneToES = filter => {
  return new Promise((resolve, reject) => {
    ModelES.findOne(filter, (err, doc) => {
      doc.esIndex((err, res) => {
        err
          ? reject(err)
          : resolve({
              status: `Indexing successful with status: ${res.result}`,
            });
      });
    });
  });
};

export const indexUpdatesToES = () => {
  let currentDate = new Date();
  let dateSearch = currentDate.toISOString().replace(/[T].*[Z]/g, 'T00:00:00.000Z');
  var inputDate = new Date(dateSearch);
  return indexModelsToES({
    updatedAt: {
      $gte: inputDate,
    },
  });
};

export const indexAllToES = () => {
  return indexModelsToES();
};

const indexModelsToES = filter => {
  return new Promise((resolve, reject) => {
    let output = [];

    ModelES.on('es-bulk-data', function(doc) {
      output.push(doc.model_name);
    });

    ModelES.on('es-bulk-error', function(err) {
      reject(err);
    });

    ModelES.esSynchronize(filter || {}).then(result => {
      resolve({
        status: 'Indexing complete.',
        models_indexed: output,
      });
    });
  });
};
