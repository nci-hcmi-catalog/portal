import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import Model, { ModelSchema } from './data/schemas/model';
import { isEqual } from 'lodash';

import { getSheetData, typeToParser, NAtoNull, getAuthClient } from './data/import/SheetsToMongo';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

const port = process.env.PORT || 8080;
const app = express();
const http = Server(app);
app.use(cors());

app.get('/sheets-data/:sheetId/:tabName', async (req, res) => {
  const authClient = getAuthClient();
  const { sheetId, tabName } = req.params;
  getSheetData({ authClient, sheetId, tabName })
    .then(data => res.json(data))
    .catch(error =>
      res.json({
        error: `error reading sheet ID ${sheetId}, ${error}`,
      }),
    );
});

app.get('/sync-mongo/:sheetId/:tabName', async (req, res) => {
  const authClient = getAuthClient();
  const { sheetId, tabName } = req.params;
  getSheetData({ authClient, sheetId, tabName })
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
          { model_name: p.model_name },
          { _id: false, __v: false }, //omit mongoose generated fields
        );
        if (prevModel) {
          if (!isEqual(prevModel._doc, p)) {
            return Model.findOneAndUpdate({ model_name: p.model_name }, p, {
              upsert: true,
              new: true,
              runValidators: true,
            });
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
        .catch(error => res.json({ error }));
    })
    .catch(error =>
      res.json({
        error: `error reading sheet, ${error}`,
      }),
    );
});

http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
