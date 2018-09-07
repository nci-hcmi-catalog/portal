import express from 'express';
import { unionWith, uniqWith, isEqual } from 'lodash';

import { toExcelHeaders, toExcelRowNumber } from '../schemas/constants';
import Model, { ModelSchema } from '../schemas/model';
import { saveValidation } from '../validation/model';
import { modelVariantUploadSchema } from '../validation/variant';

import {
  getSheetData,
  typeToParser,
  NAtoNull,
  getAuthClient,
} from '../services/import/SheetsToMongo';

export const data_sync_router = express.Router();

const ensureAuth = req =>
  new Promise((resolve, reject) => {
    const {
      headers: { authorization },
    } = req;

    //TODO: error handling if auth is not passed or invalid
    try {
      const authClient = getAuthClient(authorization);
      resolve(authClient);
    } catch (error) {
      reject(error);
    }
  });

data_sync_router.get('/sheets-data/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(data => res.json(data))
    .catch(error =>
      res.status(500).json({
        message: `An unexpected error occurred while trying to read Google Sheet ID: ${sheetId}, ${error}`,
      }),
    );
});

data_sync_router.get('/wrangle-cde/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(data => {
      const transformed = Object.entries(toExcelRowNumber).reduce((acc, [type, rowNumber]) => {
        return {
          ...acc,
          [type]: Object.entries(toExcelHeaders).reduce((acc, [diagnosis, excelHeader]) => {
            const valueRaw = data[rowNumber][excelHeader] || '';
            const values = valueRaw.includes('\n') ? valueRaw.split('\n') : valueRaw.split(', ');
            return {
              ...acc,
              [diagnosis]: values.filter(Boolean),
            };
          }, {}),
        };
      }, {});
      return res.json(transformed);
    })
    .catch(error =>
      res.json({
        error: `error reading or wrangling spreadsheet ID ${spreadsheetId} with sheet ID ${sheetId}, ${error}`,
      }),
    );
});

const removeNullKeys = data =>
  Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value !== null
        ? {
            [key]: value,
          }
        : {}),
    }),
    {},
  );

export const runYupValidators = (validator, data) => {
  const validatePromises = data.map(p =>
    validator.validate(p, { abortEarly: false }).catch(Error => Error),
  );

  return Promise.all(validatePromises).then(results => {
    const failed = results.filter(result => result instanceof Error);
    if (failed.length > 0) {
      const errors = {
        validationErrors: failed.map(({ value, inner }) => ({
          errors: inner.reduce(
            (acc, { path, message }) => ({
              ...acc,
              [path]: message,
            }),
            {},
          ),
          value,
        })),
      };
      throw errors;
    }
    return data;
  });
};

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

data_sync_router.get('/sync-mongo/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  let { overwrite } = req.query;
  overwrite = overwrite || false;
  overwrite = normalizeOption(overwrite);

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(data => {
      const parsed = data
        .filter(({ name }) => name)
        .map(d =>
          Object.keys(d)
            .filter(key => ModelSchema.paths[key])
            .reduce(
              (acc, key) => ({
                ...acc,
                [key]: typeToParser[ModelSchema.paths[key].instance](NAtoNull(d[key])),
              }),
              {},
            ),
        )
        .filter(Boolean)
        .map(d => removeNullKeys(d));
      return parsed;
    })
    .then(parsed => runYupValidators(saveValidation, parsed))
    .then(parsed => {
      const savePromises = parsed.map(async p => {
        const prevModel = await Model.findOne(
          {
            name: p.name,
          },
          {
            _id: false,
            __v: false,
          }, //omit mongoose generated fields
        );
        if (prevModel) {
          if (overwrite && !isEqual(prevModel._doc, p)) {
            return new Promise((resolve, reject) => {
              Model.findOneAndUpdate(
                {
                  name: p.name,
                },
                p,
                {
                  upsert: true,
                  new: true,
                  runValidators: true,
                },
              )
                .then(() => resolve({ status: 'updated', doc: p.name }))
                .catch(error =>
                  reject({
                    message: `An unexpected error occurred while updating model: ${
                      p.name
                    }, Error:  ${error}`,
                  }),
                );
            });
          }
          return new Promise(resolve => resolve({ status: 'ignored', doc: p.name })); //no fields modified, do nothing
        } else {
          return new Promise((resolve, reject) => {
            const newModel = new Model(p);
            newModel
              .save()
              .then(() => resolve({ status: 'created', doc: p.name }))
              .catch(error =>
                reject({
                  message: `An unexpected error occurred while creating model: ${
                    p.name
                  }, Error:  ${error}`,
                }),
              );
          });
        }
      });

      return Promise.all(savePromises)
        .then(saveResults =>
          res.json({
            result: saveResults.reduce(
              (finalResponse, saveResult) => {
                const { status, doc } = saveResult;
                finalResponse[status].push(doc);
                return finalResponse;
              },
              { ignored: [], updated: [], created: [] },
            ),
          }),
        )
        .catch(error => {
          throw error;
        });
    })
    .catch(error => res.status(500).json({ error }));
});

data_sync_router.get('/attach-variants/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  let { overwrite } = req.query;
  overwrite = overwrite || false;
  overwrite = normalizeOption(overwrite);

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(data =>
      data.map(modelVariantUpload => {
        // Remove all null / undefined / empty
        Object.keys(modelVariantUpload).forEach(
          key => !modelVariantUpload[key] && delete modelVariantUpload[key],
        );
        return modelVariantUpload;
      }),
    )
    .then(data => runYupValidators(modelVariantUploadSchema, data))
    .then(validatedData => {
      // Sort the modelVariant relations by model_name
      const mappedModelVariants = validatedData.reduce((acc, curr) => {
        const transform = input => ({
          variant: input.variant,
          assessmentType: input.assessment_type || '',
          expressionLevel: input.expression_level || '',
        });

        if (curr.model_name in acc) {
          acc[curr.model_name].push(transform(curr));
        } else {
          acc[curr.model_name] = [transform(curr)];
        }

        return acc;
      }, {});

      const savePromises = Object.keys(mappedModelVariants).map(async modelName => {
        // Upload set for the model we are operating on
        const uploadedModelVariants = uniqWith(mappedModelVariants[modelName], isEqual);

        // Get the existing model
        const model = await Model.findOne(
          {
            name: modelName,
          },
          {
            _id: false,
            __v: false,
          }, //omit mongoose generated fields
        );

        // Get existing model variants (if they exists)
        const existingModelVariants = model.variants.map(
          ({ variant, assessmentType = '' }) => `${variant}-${assessmentType}`,
        );

        // See if any updated are allowed
        const allowedUpdates = uploadedModelVariants.filter(
          ({ variant, assessmentType = '' }) =>
            overwrite || existingModelVariants.indexOf(`${variant}-${assessmentType}`) === -1,
        );

        if (allowedUpdates.length > 0) {
          const variants = unionWith(
            allowedUpdates, // this array is the "base" as it's allowd
            model.variants, // items that fail the below test are merged
            (arrVal, othVal) =>
              // checks for uniqness of these two fields together
              arrVal.variant === othVal.variant && arrVal.assessmentType === othVal.assessmentType,
          );

          return new Promise((resolve, reject) => {
            Model.findOneAndUpdate(
              {
                name: modelName,
              },
              {
                $set: { variants },
              },
              {
                upsert: true,
                new: true,
                runValidators: true,
              },
            )
              .then(() =>
                resolve({
                  status: existingModelVariants.length > 0 ? 'updated' : 'created',
                  doc: model.name,
                  variants: allowedUpdates,
                }),
              )
              .catch(error =>
                reject({
                  message: `An unexpected error occurred while updating model: ${
                    model.name
                  }, Error:  ${error}`,
                  variants: allowedUpdates,
                }),
              );
          });
        } else {
          return new Promise(resolve => resolve({ status: 'ignored', doc: model.name }));
        }
      });

      return Promise.all(savePromises)
        .then(saveResults =>
          res.json({
            result: saveResults.reduce(
              (finalResponse, saveResult) => {
                const { status, doc, variants } = saveResult;
                finalResponse[status].push({ model: doc, variants });
                return finalResponse;
              },
              { ignored: [], updated: [], created: [] },
            ),
          }),
        )
        .catch(error => {
          console.log('ERROR', error);
          throw error;
        });
    })
    .catch(error => res.status(500).json({ error }));
});
