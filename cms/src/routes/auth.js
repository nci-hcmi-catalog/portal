import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import pm2 from './../pm2.js';

import getLogger from '../logger.js';

const logger = getLogger('routes/auth');

const authRouter = express.Router();

const client_id = pm2.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const client_secret = pm2.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new OAuth2Client(
  client_id,
  client_secret,
  'postmessage', // use 'postmessage' instead of actual redirect URI https://stackoverflow.com/a/18990247
);

// get user tokens from Google authorization code following OAuth login
// adapted from https://github.com/MomenSherif/react-oauth/issues/12#issuecomment-1131408898
authRouter.post('/google', async (req, res) => {
  try {
    logger.debug(`Fetching user tokens from Google auth code...`);

    const { tokens } = await oAuth2Client.getToken(req.body.code);

    res.json(tokens);
  } catch (error) {
    logger.error(error);
    res.status(error.code).send(error);
  }
});

export default authRouter;
