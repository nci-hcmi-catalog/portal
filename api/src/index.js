import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import Arranger from '@arranger/server';
import cors from 'cors';
import lastUpdatedRouter from './lastUpdated';
import dataExportRouter from './dataExport';

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
app.use(cors());

Arranger({ enableAdmin: process.env.ENABLE_ADMIN === 'true' }).then(router => {
  app.use('/last-updated', lastUpdatedRouter);
  app.use('/export', dataExportRouter);
  app.use(router);

  http.listen(port, async () => {
    console.log(`⚡️ Listening on port ${port} ⚡️`);
  });
});
