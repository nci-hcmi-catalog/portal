import { ModelES } from './common/schemas/model';
import publishValidation from '../../validation/model';

export const indexOneToES = filter => {
  return new Promise((resolve, reject) => {
    ModelES.findOne(filter, (err, doc) => {
      // Validate doc against publish schema
      // for "on-demand" publishing
      publishValidation
        .validate(doc)
        .then(
          doc.esIndex((err, res) => {
            err
              ? reject(err)
              : resolve({
                  status: `Indexing successful with status: ${res.result}`,
                });
          }),
        )
        .catch(err => reject(err));
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
      output.push(doc.name);
    });

    ModelES.on('es-bulk-error', function(err) {
      reject(err);
    });

    // Index is being "synchronize filtered" as ModelEs
    // definition, only valid models will be published
    ModelES.esSynchronize(filter || {}).then(result => {
      resolve({
        status: 'Indexing complete.',
        models_indexed: output,
      });
    });
  });
};
