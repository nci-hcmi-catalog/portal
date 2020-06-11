import { fetchData } from '../services/Fetcher';
import config from '../config';

export const getSheetObject = sheetURL => {
  // example sheeturl:
  // https://docs.google.com/spreadsheets/d/18ZWXfsadfasdfP8NV5g_flmEhBkXgsKEJT6y9
  // i Ht0X/edit#gid=0
  // ... regex: \/d\/(.*?)\/.*gid=([0-9]*)
  // ... two groups match (1st is the sheetId, second the tabId)
  const regExp = /\/d\/(.*?)\/.*gid=([0-9]*)/g;
  const sheetUrlParts = regExp.exec(sheetURL);
  return {
    fullUrl: sheetUrlParts[0] || '',
    spreadsheetId: sheetUrlParts[1] || '',
    sheetId: sheetUrlParts[2] || '',
  };
};
export const getUploadTemplate = async () => {
  const gapi = global.gapi;

  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
  const googleAuthResponse = currentUser.getAuthResponse();

  const response = await fetchData({
    url: `${config.urls.cmsBase}/templates/models`,
    method: 'get',
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });

  return response.data;
};
