import 'babel-polyfill';
import express from 'express';
import socketIO from 'socket.io';
import { Server } from 'http';
import { rainbow } from 'chalk-animation';
import Arranger from '@arranger/server';
import cors from 'cors';
import mongoose from 'mongoose';
import Model, { ModelSchema } from './schemas/model';

import { getSheetData, typeToParser, getAuthClient } from './SheetsToMongo';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
const io = socketIO(http);
app.use(cors());

Arranger({ io }).then(router => {
  app.use(router);

  app.get('/sheets-data', async (req, res) => {
    const authClient = getAuthClient();
    getSheetData(authClient)
      .then(data => res.json(data))
      .catch(error => res.json({ error: `error reading sheet, ${error}` }));
  });

  app.get('/sync-mongo', async (req, res) => {
    const authClient = getAuthClient();
    getSheetData(authClient)
      .then(data => {
        const parsed = data
          .filter(({ model_name }) => model_name)
          .map(d =>
            Object.keys(d).reduce(
              (acc, key) => ({
                ...acc,
                [key]: typeToParser[ModelSchema.paths[key].instance](d[key]),
              }),
              {},
            ),
          )
          .filter(Boolean);

        const savePromises = parsed.map(p => {
          const model = new Model(p);
          return model.save();
        });

        Promise.all(savePromises)
          .then(docs => res.json({ docs }))
          .catch(error => error);
      })
      .catch(error => res.json({ error: `error reading sheet, ${error}` }));
  });

  http.listen(port, async () => {
    rainbow(`⚡️ Listening on port ${port} ⚡️`);
  });
});
