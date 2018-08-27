import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import restify from 'express-restify-mongoose';
import morgan from 'morgan';

import { data_sync_router, runYupValidators } from './routes/sync-data';
import { publishRouter, imagesRouter, unpublishRouter } from './routes';
import Model from './schemas/model';

const port = process.env.PORT || 8080;
const app = express();
const router = express.Router();

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

const validateYup = (req, res, next) => {
  runYupValidators([req.body])
    .then(() => next())
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
};
// configure endpoints
restify.serve(router, Model, {
  preCreate: validateYup,
  preUpdate: validateYup,
  idProperty: 'name',
});

app.use('/api/v1', data_sync_router);
app.use('/api/v1/publish', publishRouter);
app.use('/api/v1/unpublish', unpublishRouter);
app.use('/api/v1/images', imagesRouter);
app.use(router);

// start app
const http = Server(app);
http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
