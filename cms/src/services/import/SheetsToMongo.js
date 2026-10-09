import { google } from 'googleapis';

export const getSheetData = ({ authClient, spreadsheetId, sheetId }) => {
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.batchGetByDataFilter(
      {
        spreadsheetId,
        resource: {
          dataFilters: [
            {
              gridRange: {
                sheetId: parseInt(sheetId, 10) || 0,
              },
            },
          ],
        },
      },
      (err, resp) => {
        if (err) {
          reject(err);
          return;
        }
        const { data } = resp;
        const rows = data.valueRanges[0].valueRange.values;
        const asObjects = rows.slice(1).map((r) =>
          rows[0].reduce(
            (acc, heading, i) => ({
              ...acc,
              [heading.toLowerCase().replace(/ /g, '_').replace('*', '')]: r[i],
            }),
            {},
          ),
        );
        resolve(asObjects);
      },
    );
  });
};

export const NAtoNull = (data) =>
  ['n/a', 'na', ''].includes((data || '').toLowerCase()) ? null : data;

export const typeToParser = {
  String: (data) => (data ? `${data}` : null),
  Number: (data) =>
    data ? (`${data}`.length === 0 ? null : isNaN(Number(data)) ? data : Number(data)) : null, //return null for null or empty values; dont return null if wrong type so validators are still triggered
  Array: (data) => (data ? data.split('|') : []),
  Date: (data) => data,
  Boolean: (data) => {
    return {
      yes: true,
      no: false,
      true: true,
      false: false,
      '': null,
    }[(data || '').toLowerCase()];
  },
};
