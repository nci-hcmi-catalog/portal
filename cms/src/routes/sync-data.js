// @ts-check

import express from 'express';
import { unionWith, uniqWith, isEqual } from 'lodash';

import { toExcelHeaders, toExcelRowNumber } from '../schemas/constants';
import Model, { ModelSchema } from '../schemas/model';
import Variant from '../schemas/variant';
import { getSaveValidation } from '../validation/model';
import { modelVariantUploadSchema } from '../validation/variant';
import { modelStatus, ensureAuth, computeModelStatus, runYupValidatorFailSlow } from '../helpers';
import { getSheetData, typeToParser, NAtoNull } from '../services/import/SheetsToMongo';
import { getLoggedInUser } from '../helpers/authorizeUserAccess';

import getLogger from '../logger';
const logger = getLogger('routes/sync-data');

export const data_sync_router = express.Router();

// 2020-05-05 Jon - Pretty sure this end point is not used anywhere, might consider removing.
data_sync_router.get('/sheets-data/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(data => res.json(data))
    .catch(error => {
      logger.error(error, 'Unexpected error occurred while reading Google Sheets');
      res.status(500).json({
        message: `An unexpected error occurred while trying to read Google Sheet ID: ${sheetId}, ${error}`,
      });
    });
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
    .catch(error => {
      logger.error(
        { error, sheetId, spreadsheetId },
        'Unexpected error while reading Google Sheet',
      );
      res.json({
        error: `error reading or wrangling spreadsheet ID ${spreadsheetId} with sheet ID ${sheetId}, ${error}`,
      });
    });
});

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

data_sync_router.get('/bulk-models/:spreadsheetId/:sheetId', async (req, res) => {
  const { spreadsheetId, sheetId } = req.params;

  let { overwrite } = req.query;
  overwrite = overwrite || false;
  overwrite = normalizeOption(overwrite);

  ensureAuth(req)
    .then(authClient => getSheetData({ authClient, spreadsheetId, sheetId }))
    .then(async data => {
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
        .filter(Boolean);
      const validation = await getSaveValidation();
      return runYupValidatorFailSlow(validation, parsed);
    })
    .then(validated => {
      const savePromises = validated
        .filter(({ success }) => success)
        .map(async ({ result }) => {
          const prevModel = await Model.findOne(
            {
              name: result.name,
            },
            {
              _id: false,
              __v: false,
              updatedBy: false,
              updatedAt: false,
              files: false,
              createdAt: false,
            }, //omit mongoose generated fields
          );
          if (prevModel) {
            if (overwrite && !isEqual(prevModel._doc, result)) {
              // Prevent removing variants in overwrite
              result.variants = prevModel._doc.variants || [];

              result.status =
                prevModel._doc.status === modelStatus.published
                  ? modelStatus.unpublishedChanges
                  : prevModel._doc.status;

              return new Promise((resolve, reject) => {
                Model.findOneAndUpdate(
                  {
                    name: result.name,
                  },
                  addUserEmail(req, result),
                  {
                    upsert: true,
                    new: true,
                    runValidators: true,
                  },
                )
                  .then(() => resolve({ status: 'updated', doc: result.name }))
                  .catch(error => {
                    logger.error(
                      { error, model: result.name },
                      'Unexpected error occurred while updating one model in bulk update',
                    );
                    reject({
                      message: `An unexpected error occurred while updating model: ${
                        result.name
                      }, Error:  ${error}`,
                    });
                  });
              });
            }
            return new Promise(resolve => resolve({ status: 'unchanged', doc: result.name })); //no fields modified, do nothing
          } else {
            return new Promise((resolve, reject) => {
              const newModel = new Model(addUserEmail(req, result));
              newModel
                .save()
                .then(() => resolve({ status: 'new', doc: result.name }))
                .catch(error => {
                  logger.error(
                    { error, model: result.name },
                    'Unexpected error occurred while creating model during bulk data sync',
                  );
                  reject({
                    message: `An unexpected error occurred while creating model: ${
                      result.name
                    }, Error:  ${error}`,
                  });
                });
            });
          }
        });

      const validationErrors = validated
        .filter(({ success }) => !success)
        .map(({ errors }) => errors);

      return Promise.all(savePromises)
        .then(saveResults =>
          res.json({
            result: saveResults.reduce(
              (finalResponse, saveResult) => {
                const { status, doc } = saveResult;
                finalResponse[status].push(doc);
                return finalResponse;
              },
              { unchanged: [], updated: [], new: [], errors: validationErrors },
            ),
          }),
        )
        .catch(error => {
          throw error;
        });
    })
    .catch(error => {
      logger.error(error, 'Unexpected error occured in bulk upload');
      res.status(500).json({ error: error.details || 'Unknown error occurred.' });
    });
});

data_sync_router.get('/attach-variants/:spreadsheetId/:sheetId/:modelName', async (req, res) => {
  const { spreadsheetId, sheetId, modelName } = req.params;

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
    .then(data => runYupValidatorFailSlow(modelVariantUploadSchema, data))
    .then(validated =>
      Promise.all(
        validated.map(validatedVariant => {
          if (validatedVariant.success) {
            const variantData = validatedVariant.result;
            return Variant.findOne({
              name: variantData.variant_name,
              type: variantData.variant_type,
            }).then(variantResult => {
              // If no variant found return an error in
              // the same format as validation errors
              if (!variantResult) {
                return {
                  success: false,
                  errors: {
                    name: variantData.variant_name || 'Unknown',
                    details: [
                      `No variant found matching "${variantData.variant_name}" and "${
                        variantData.variant_type
                      }" in database.`,
                    ],
                  },
                };
              }

              // Modify the succsefully found and validated variant
              // before passing it forward to the next step
              return {
                success: true,
                result: {
                  model_name: variantData.model_name,
                  variant: variantResult._id,
                  assessment_type: variantData.assessment_type,
                  expression_level: variantData.expression_level,
                },
              };
            });
          } else {
            // Return the unsuccessfull validation error like normal
            return new Promise(resolve => resolve(validatedVariant));
          }
        }),
      ),
    )
    .then(populatedVariants => {
      // Sort the modelVariant relations by model_name
      const mappedModelVariants = populatedVariants
        .filter(({ success }) => success)
        .reduce((acc, { result }) => {
          // Get model name
          const model_name = result.model_name;

          // ignore any updates to any other model if a tagetModelName is provided
          if (modelName && model_name !== modelName) {
            return acc;
          }
          // Delete model name from final variant object
          delete result.model_name;

          if (model_name in acc) {
            acc[model_name].push(result);
          } else {
            acc[model_name] = [result];
          }

          return acc;
        }, {});

      // Process all successfully populated variants as normal
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
                updatedBy: getLoggedInUser(req).user_email,
                variants,
                variants_modified: true,
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
              .catch(error => {
                logger.error(
                  { error, model: model.name },
                  'Unexpected error occured while updating model in bulk data sync',
                );
                reject({
                  message: `An unexpected error occurred while updating model: ${
                    model.name
                  }, Error:  ${error}`,
                  variants: allowedUpdates,
                });
              });
          });
        } else {
          return new Promise(resolve =>
            resolve({ status: 'unchanged', doc: model.name, variants: uploadedModelVariants }),
          );
        }
      });

      // Gather the errors for reporting along with the success
      const errors = populatedVariants
        .filter(({ success }) => !success)
        .map(({ errors }) => errors);

      return Promise.all(savePromises)
        .then(saveResults =>
          res.json({
            result: saveResults.reduce(
              (finalResponse, saveResult) => {
                const { status, doc, variants } = saveResult;
                finalResponse[status].push({ model: doc, variants });
                return finalResponse;
              },
              { unchanged: [], updated: [], new: [], errors },
            ),
          }),
        )
        .catch(error => {
          throw error;
        });
    })
    .catch(error => {
      logger.error(error, 'Unexpected error occurred during Sync Data');
      return res.status(500).json({ error: error instanceof Error ? error.message : error });
    });
});

const addUserEmail = (req, model) => {
  model.updatedBy = getLoggedInUser(req).user_email;
  return model;
};
