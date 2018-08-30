import express from 'express';
import { isEqual } from 'lodash';

import { toExcelHeaders, toExcelRowNumber } from '../schemas/constants';
import Model, { ModelSchema } from '../schemas/model';
import { saveValidation } from '../validation/model';

import {
  getSheetData,
  typeToParser,
  NAtoNull,
  getAuthClient,
} from '../services/import/SheetsToMongo';

export const data_sync_router = express.Router();

data_sync_router.get('/sheets-data/:sheetId/:tabName', async (req, res) => {
  const { sheetId, tabName } = req.params;
  try {
    const {
      headers: { authorization },
    } = req;
    //TODO: error handling if auth is not passed
    const authClient = getAuthClient(authorization);

    getSheetData({ authClient, sheetId, tabName })
      .then(data => res.json(data))
      .catch(error => {
        throw error;
      });
  } catch (error) {
    res.status(500).json({
      message: `An unexpected error occurred while trying to read Google Sheet ID: ${sheetId}, ${error}`,
    });
  }
});

data_sync_router.get('/wrangle-cde/:sheetId/:tabName', async (req, res) => {
  const authClient = getAuthClient();
  const { sheetId, tabName } = req.params;
  getSheetData({ authClient, sheetId, tabName })
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
      res.json({ error: `error reading or wrangling sheet ID ${sheetId}, ${error}` }),
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

export const runYupValidators = parsed => {
  const validatePromises = parsed.map(p =>
    saveValidation.validate(p, { abortEarly: false }).catch(Error => Error),
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
    return parsed;
  });
};

data_sync_router.get('/sync-mongo/:sheetId/:tabName', async (req, res) => {
  try {
    const {
      headers: { authorization },
    } = req;
    //TODO: error handling if auth is not passed
    const authClient = getAuthClient(authorization);
    const { sheetId, tabName } = req.params;
    let { overwrite } = req.query;
    overwrite = overwrite || false;
    getSheetData({ authClient, sheetId, tabName })
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
      .then(runYupValidators)
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
      .catch(error => {
        throw error;
      });
  } catch (error) {
    res.status(500).json({ message: `An unexpected error occurred: ${error}` });
  }
});
