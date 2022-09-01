// @ts-check

import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import restify from 'express-restify-mongoose';
import pino from 'pino-http';
import helmet from 'helmet';

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
  publishRouter,
  authRouter,
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

import getLogger from './logger';
const logger = getLogger('root');

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

// 20Mb needed when saving/publishing models with long variant lists.
//  Max observed has been 1.5Mb for ~2k variants, but this was set higher
//  to prevent support work later
app.use(bodyParser.json({ limit: '20mb' }));

app.use(methodOverride());
app.use(cors());

// HealthRouter must be added before the declaration for isUserAuthorized filter
app.use('/api/v1/health', healthRouter);

if (process.env.AUTH_ENABLED !== 'false') {
  app.use(async (req, res, next) => {
    const authorized = await isUserAuthorized(req);
    if (!authorized) {
      logger.error(`Unauthorized Request: ${req.method}, ${req.url}, ${req.headers[USER_EMAIL]}`);
      return res.status(403).json({
        error: `${req.headers[USER_EMAIL] ||
          'Unknown user'} is not authorized to access this application.`,
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
app.use('/api/v1/publish', publishRouter);
app.use('/api/v1/auth', authRouter);
app.use(matchedModelsRestifyRouter);
app.use(modelRouter);
app.use(userRouter);

// start app
const http = new Server(app);
http.listen(port, async () => {
  logger.info({ port }, `CMS Started!`);
});
