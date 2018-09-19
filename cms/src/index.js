// @ts-check

import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import restify from 'express-restify-mongoose';
import morgan from 'morgan';

import { data_sync_router } from './routes/sync-data';
import { imagesRouter, publishRouter } from './routes';
import { preUpdate, validateYup, preModelDelete, postUpdate } from './hooks';
import Model from './schemas/model';

const port = process.env.PORT || 8080;
const app = express();
const router = express.Router();

// Handle "unhandled" promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('------------------------------------------------');
  console.log('For promise:', promise);
});

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
});

// configure server
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// configure logging
app.use(morgan('combined'));

// configure endpoints
restify.serve(router, Model, {
  preCreate: validateYup,
  preUpdate,
  postUpdate: postUpdate,
  preDelete: preModelDelete,
  idProperty: 'name',
});

app.use('/api/v1', data_sync_router);
app.use('/api/v1/publish', publishRouter);
app.use('/api/v1/images', imagesRouter);
app.use(router);

// start app
const http = new Server(app);
http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
