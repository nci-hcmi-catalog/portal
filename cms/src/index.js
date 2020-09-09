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
import pino from 'pino-http';
import helmet from 'helmet';

import getLogger from './logger';
const logger = getLogger('root');

import { data_sync_router } from './routes/sync-data';
import {
  actionRouter,
  healthRouter,
  bulkRouter,
  dictionaryRouter,
  imagesRouter,
  matchedModelsRouter as matchedModelsActionsRouter,
  templatesRouter,
  variantsRouter,
} from './routes';
import {
  preUpdate,
  validateYup,
  preModelDelete,
  postUpdate,
  postCreate,
  outputFn,
  validateUserRequest,
} from './hooks';
import Model from './schemas/model';
import MatchedModels from './schemas/matchedModels';
import User from './schemas/user';
import isUserAuthorized, { USER_EMAIL, getLoggedInUser } from './helpers/authorizeUserAccess';

const port = process.env.PORT || 8080;
const app = express();
const modelRouter = express.Router();
const matchedModelsRestifyRouter = express.Router();
const userRouter = express.Router();

// Handle "unhandled" promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.warn({ ...reason, ...promise }, 'Unhandled Promise Rejection');
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

// HealthRouter must be added before the declaration for isUserAuthorized filter
app.use('/api/v1/health', healthRouter);

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
app.use(pino({ reqCustomProps: req => ({ user: getLoggedInUser(req).user_email }) }));

// configure endpoints
restify.serve(modelRouter, Model, {
  preCreate: validateYup,
  postCreate,
  preUpdate,
  preDelete: preModelDelete,
  postUpdate: postUpdate,
  outputFn,
  idProperty: 'name',
});

restify.serve(matchedModelsRestifyRouter, MatchedModels);

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
app.use('/api/v1/dictionary', dictionaryRouter);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/action', actionRouter);

app.use('/api/v1/templates', templatesRouter);
app.use('/api/v1/genomic-variants', variantsRouter);
app.use('/api/v1/matches', matchedModelsActionsRouter);
app.use(matchedModelsRestifyRouter);
app.use(modelRouter);
app.use(userRouter);

// start app
const http = new Server(app);
http.listen(port, async () => {
  logger.info({ port }, `CMS Started!`);
});
