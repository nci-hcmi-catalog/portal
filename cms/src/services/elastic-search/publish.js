import { ModelES } from './common/schemas/model';
import publishValidation from '../../validation/model';
import { modelStatus } from '../../helpers/modelStatus';

export const indexOneToES = filter => {
  return new Promise((resolve, reject) => {
    ModelES.findOne(filter)
      .populate('variants.variant')
      .exec((err, doc) => {
        if (err) {
          reject(err);
        }
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

export const indexModelsToES = filter => {
  // Need to validate models first
  return new Promise((resolve, reject) => {
    let result = {
      success: [],
      error: [],
    };

    ModelES.on('es-bulk-data', function(doc) {
      ModelES.findOneAndUpdate(
        {
          name: doc.name,
        },
        { status: modelStatus.published },
        {
          upsert: true,
          new: true,
        },
      ).then(() => result.success.push(doc.name));
    });

    ModelES.on('es-bulk-error', function(err) {
      result.error.push(err);
    });

    // Populate Models with variants
    const query = ModelES.find(filter || {}).populate('variants.variant');

    ModelES.esSynchronize(query).then(() => {
      resolve({
        status: 'Indexing complete.',
        result,
      });
    });
  });
};
