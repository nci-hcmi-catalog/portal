import express from 'express';
import { isEqual } from 'lodash';

import { toExcelHeaders, toExcelRowNumber } from '../schemas/constants';
import Model, { ModelSchema } from '../schemas/model';
import modelValidation from '../validation/model';

import {
  getSheetData,
  typeToParser,
  NAtoNull,
  getAuthClient,
} from '../services/import/SheetsToMongo';

export const data_sync_router = express.Router();

data_sync_router.get('/sheets-data/:sheetId/:tabName', async (req, res) => {
  const {
    headers: { authorization },
  } = req;
  //TODO: error handling if auth is not passed
  const authClient = getAuthClient(authorization);
  const { sheetId, tabName } = req.params;
  getSheetData({ authClient, sheetId, tabName })
    .then(data => res.json(data))
    .catch(error => res.json({ error: `error reading sheet ID ${sheetId}, ${error}` }));
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
    modelValidation.validate(p, { abortEarly: false }).catch(Error => Error),
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
  const {
    headers: { authorization },
  } = req;
  //TODO: error handling if auth is not passed
  const authClient = getAuthClient(authorization);
  const { sheetId, tabName } = req.params;
  getSheetData({ authClient, sheetId, tabName })
    .then(data => {
      const parsed = data
        .filter(({ model_name }) => model_name)
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
    //.then(runYupValidators)
    .then(parsed => {
      const savePromises = parsed.map(async p => {
        const prevModel = await Model.findOne(
          {
            model_name: p.model_name,
          },
          {
            _id: false,
            __v: false,
          }, //omit mongoose generated fields
        );
        if (prevModel) {
          if (!isEqual(prevModel._doc, p)) {
            return Model.findOneAndUpdate(
              {
                model_name: p.model_name,
              },
              p,
              {
                upsert: true,
                new: true,
                runValidators: true,
              },
            );
          }
          return new Promise(resolve => resolve({})); //no fields modified, do nothing
        } else {
          const newModel = new Model(p);
          return newModel.save();
        }
      });

      return Promise.all(savePromises).then(docs =>
        res.json({
          docs: docs.filter(d => !!Object.keys(d).length),
        }),
      );
    })
    .catch(error => {
      res.json({ error });
    });
});
