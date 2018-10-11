import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import Arranger from '@arranger/server';
import cors from 'cors';
import lastUpdatedRouter from './lastUpdated';

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
app.use(cors());

Arranger().then(router => {
  app.use(router);
  app.use('/last-updated', lastUpdatedRouter);

  http.listen(port, async () => {
    console.log(`⚡️ Listening on port ${port} ⚡️`);
  });
});
