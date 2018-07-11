import { ModelES } from './es/schemas/model';

export const indexOneToES = filter => {
  ModelES.findOne(filter, (err, doc) => {
    doc.esIndex((err, res) => {
      err
        ? console.log(`Indexing failed with error: ${err}`)
        : console.log(`Indexing successful with status: ${res.result}`);
    });
  });
};

export const indexUpdatesToES = () => {
  let currentDate = new Date();
  let dateSearch = currentDate.toISOString().replace(/[\T].*[\Z]/g, 'T00:00:00.000Z');
  var inputDate = new Date(dateSearch);

  indexModelsToES({
    updatedAt: {
      $gte: inputDate,
    },
  });
};

export const indexAllToES = () => {
  indexModelsToES();
};

const indexModelsToES = filter => {
  let count = 1;

  ModelES.on('es-bulk-data', function(doc) {
    console.log(`Indexing document # ${count++} with name: ${doc.name}`);
  });

  ModelES.on('es-bulk-error', function(err) {
    console.error(err);
  });

  ModelES.esSynchronize(filter || {}).then(result => {
    console.log('Indexing Complete.');
  });
};
