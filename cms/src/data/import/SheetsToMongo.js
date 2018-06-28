import fs from 'fs';
import { google } from 'googleapis';

export const getAuthClient = () => {
  const OAuth2Client = google.auth.OAuth2;
  const TOKEN_PATH = 'token.json';

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uris = process.env.REDIRECT_URIS;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  const token = fs.readFileSync(TOKEN_PATH, 'utf8');
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
};

export const getSheetData = ({ authClient, sheetId, tabName }) => {
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: sheetId,
        range: `${tabName}!A1:AC`,
      },
      (err, resp) => {
        if (err) {
          reject(err);
          return;
        }
        const { data } = resp;
        const rows = data.values;
        const asObjects = rows.slice(1).map(r =>
          rows[0].reduce(
            (acc, heading, i) => ({
              ...acc,
              [heading
                .toLowerCase()
                .replace(/ /g, '_')
                .replace('*', '')]: r[i],
            }),
            {},
          ),
        );
        resolve(asObjects);
      },
    );
  });
};

export const typeToParser = {
  String: data => (data ? `${data}` : null),
  Number: data => (isNaN(Number(data)) ? null : Number(data)),
  Date: data => {
    const parsed = Date.parse(data);
    return isNaN(parsed) ? null : parsed;
  },
  Boolean: data => {
    return (
      {
        yes: true,
        no: false,
        true: true,
        false: false,
      }[(data || '').toLowerCase()] || false
    );
  },
};
