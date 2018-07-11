import express from 'express';
import Model, { ModelSchema } from '../schemas/model';
import { isEqual } from 'lodash';

import {
  getSheetData,
  typeToParser,
  NAtoNull,
  getAuthClient,
} from '../services/import/SheetsToMongo';

export const data_sync_router = express.Router();

data_sync_router.get('/sheets-data/:sheetId/:tabName', async (req, res) => {
  const authClient = getAuthClient();
  const { sheetId, tabName } = req.params;
  getSheetData({
    authClient,
    sheetId,
    tabName,
  })
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: `error reading sheet ID ${sheetId}, ${error}`,
      }),
    );
});

data_sync_router.get('/sync-mongo/:sheetId/:tabName', async (req, res) => {
  const authClient = getAuthClient();
  const { sheetId, tabName } = req.params;
  getSheetData({
    authClient,
    sheetId,
    tabName,
  })
    .then(data => {
      const parsed = data
        .filter(({ model_name }) => model_name)
        .map(d =>
          Object.keys(d).reduce(
            (acc, key) => ({
              ...acc,
              [key]: typeToParser[ModelSchema.paths[key].instance](NAtoNull(d[key])),
            }),
            {},
          ),
        )
        .filter(Boolean);

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

      Promise.all(savePromises)
        .then(docs =>
          res.json({
            docs: docs.filter(d => !!Object.keys(d).length),
          }),
        )
        .catch(error =>
          res.json({
            error,
          }),
        );
    })
    .catch(error =>
      res.json({
        error: `error reading sheet, ${error}`,
      }),
    );
});
