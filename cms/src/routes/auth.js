import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import getLogger from '../logger';

const logger = getLogger('routes/auth');

const authRouter = express.Router();

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
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
