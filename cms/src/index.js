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
import helmet from 'helmet';

import { data_sync_router } from './routes/sync-data';
import { imagesRouter, bulkRouter, actionRouter, templatesRouter } from './routes';
import {
  preUpdate,
  validateYup,
  preModelDelete,
  postUpdate,
  outputFn,
  validateUserRequest,
} from './hooks';
import Model from './schemas/model';
import User from './schemas/user';
import isUserAuthorized, { USER_EMAIL, getLoggedInUser } from './helpers/authorizeUserAccess';

const port = process.env.PORT || 8080;
const app = express();
const modelRouter = express.Router();
const userRouter = express.Router();

// Handle "unhandled" promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('------------------------------------------------');
  console.log('For promise:', promise);
});

// Ensures uniques actually work
// (default results in log: mongoose collection.ensureIndex is deprecated. Use createIndexes)
mongoose.set('useCreateIndex', true);

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
});

// configure server
app.use(helmet());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// configure logging
// record user email for each authenticated request
app.use(morgan('combined'));
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[USER_EMAIL]',
  ),
);

if (process.env.AUTH_ENABLED !== 'false') {
  app.use((req, res, next) => {
    if (!isUserAuthorized(req)) {
      return res.status(403).json({
        error: `${req.headers[USER_EMAIL] ||
          'Unknown user '} is not authorized to access this application.`,
      });
    }
    next();
  });
}

// configure endpoints
restify.serve(modelRouter, Model, {
  preCreate: validateYup,
  preUpdate,
  preDelete: preModelDelete,
  postUpdate: postUpdate,
  outputFn,
  idProperty: 'name',
});

// configure endpoints
restify.serve(userRouter, User, {
  preCreate: validateUserRequest,
  preUpdate: validateUserRequest,
});

// get logged in user info
app.get('/api/v1/loggedInUser', (req, res) => {
  res.json(getLoggedInUser(req));
});

app.use('/api/v1', data_sync_router);
app.use('/api/v1/bulk', bulkRouter);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/action', actionRouter);
app.use('/api/v1/templates', templatesRouter);
app.use(modelRouter);
app.use(userRouter);

// start app
const http = new Server(app);
http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
