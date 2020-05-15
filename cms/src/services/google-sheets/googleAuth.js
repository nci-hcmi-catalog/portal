import { google } from 'googleapis';

export default userToken => {
  const OAuth2Client = google.auth.OAuth2;
  const TOKEN_PATH = 'token.json';

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uris = process.env.REDIRECT_URIS;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  const token = userToken || fs.readFileSync(TOKEN_PATH, 'utf8');
  // TODO: validate token with google before proceeding
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
};
