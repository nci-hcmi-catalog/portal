import fs from 'fs';
import { google } from 'googleapis';

import pm2 from './../../pm2';

const googleAuth = (userToken) => {
  const OAuth2Client = google.auth.OAuth2;
  const TOKEN_PATH = 'token.json';

  const client_id = pm2.CLIENT_ID || process.env.CLIENT_ID;
  const client_secret = pm2.CLIENT_SECRET || process.env.CLIENT_SECRET;
  const redirect_uris = pm2.REDIRECT_URIS || process.env.REDIRECT_URIS;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  const token = userToken || fs.readFileSync(TOKEN_PATH, 'utf8');
  // TODO: validate token with google before proceeding
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
};

export default googleAuth;
