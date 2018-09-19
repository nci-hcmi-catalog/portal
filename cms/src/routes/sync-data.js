import express from 'express';
import { unionWith, uniqWith, isEqual } from 'lodash';

import { toExcelHeaders, toExcelRowNumber } from '../schemas/constants';
import Model, { ModelSchema } from '../schemas/model';
import Variant from '../schemas/variant';
import { saveValidation } from '../validation/model';
import { modelVariantUploadSchema } from '../validation/variant';

import { ensureAuth, computeModelStatus, runYupValidators } from '../helpers';

import { getSheetData, typeToParser, NAtoNull } from '../services/import/SheetsToMongo';

export const data_sync_router = express.Router();

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

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

data_sync_router.get('/sync-mongo/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  let { overwrite } = req.query;
  overwrite = overwrite || false;
  overwrite = normalizeOption(overwrite);

  // TODO - Do not fail fast, instead do entire bulk operation and report
  // https://nmaggioni.xyz/2016/10/13/Avoiding-Promise-all-fail-fast-behavior/
  // (bottom solution)

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
          return new Promise(resolve => resolve({ status: 'unchanged', doc: p.name })); //no fields modified, do nothing
        } else {
          return new Promise((resolve, reject) => {
            const newModel = new Model(p);
            newModel
              .save()
              .then(() => resolve({ status: 'new', doc: p.name }))
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
              { unchanged: [], updated: [], new: [] },
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

  // TODO - Do not fail fast, instead do entire bulk operation and report
  // https://nmaggioni.xyz/2016/10/13/Avoiding-Promise-all-fail-fast-behavior/
  // (bottom solution)

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
    .then(validatedData =>
      Promise.all(
        validatedData.map(validatedVariant =>
          Variant.findOne({
            name: validatedVariant.variant_name,
            type: validatedVariant.variant_type,
          }).then(variant => {
            if (!variant) {
              const error = {
                message: `No variant found matching "${validatedVariant.variant_name}" and "${
                  validatedVariant.variant_type
                }" in database.`,
              };
              throw error;
            }

            return {
              model_name: validatedVariant.model_name,
              variant: variant._id,
              assessment_type: validatedVariant.assessment_type,
              expression_level: validatedVariant.expression_level,
            };
          }),
        ),
      ),
    )
    .then(populatedVariants => {
      // Sort the modelVariant relations by model_name
      const mappedModelVariants = populatedVariants.reduce((acc, curr) => {
        // Get model name
        const model_name = curr.model_name;

        // Delete model name from final variant object
        delete curr.model_name;

        if (model_name in acc) {
          acc[model_name].push(curr);
        } else {
          acc[model_name] = [curr];
        }

        return acc;
      }, {});

      const savePromises = Object.keys(mappedModelVariants).map(async model_name => {
        // Upload set for the model we are operating on
        const uploadedModelVariants = uniqWith(mappedModelVariants[model_name], isEqual);

        // Get the existing model populated with variant data (omit mongoose generated fields)
        const model = await Model.findOne(
          {
            name: model_name,
          },
          {
            _id: false,
            __v: false,
          },
        );

        // Get existing model variant ids (if they exists)
        const existingModelVariants = model.variants.map(({ variant }) => variant.toString());

        // See if any updated are allowed
        const allowedUpdates = uploadedModelVariants.filter(({ variant }) => {
          return overwrite || existingModelVariants.indexOf(variant.toString()) === -1;
        });

        if (allowedUpdates.length > 0) {
          const variants = unionWith(
            allowedUpdates, // this array is the "base" as it's allowd
            model.variants, // items that fail the below test are merged
            (arrVal, othVal) =>
              // checks for uniqness of these fields together
              arrVal.variant.toString() === othVal.variant.toString() &&
              arrVal.assessment_type === othVal.assessment_type,
          );

          return new Promise((resolve, reject) => {
            Model.findOneAndUpdate(
              {
                name: model_name,
              },
              {
                status: computeModelStatus(model.status, 'save'),
                variants,
              },
              {
                upsert: true,
                new: true,
                runValidators: true,
              },
            )
              .then(() =>
                resolve({
                  status: existingModelVariants.length > 0 ? 'updated' : 'new',
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
          return new Promise(resolve =>
            resolve({ status: 'unchanged', doc: model.name, variants: uploadedModelVariants }),
          );
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
              { unchanged: [], updated: [], new: [] },
            ),
          }),
        )
        .catch(error => {
          throw error;
        });
    })
    .catch(error => {
      console.log('Sync Data Error: ', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : error });
    });
});
