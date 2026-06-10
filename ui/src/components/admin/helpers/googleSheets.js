import { fetchData } from '../services/Fetcher';
import config from '../config';
import { getAuth } from './googleAuth';

export const getSheetObject = (sheetURL) => {
  // Example sheeturl:
  // https://docs.google.com/spreadsheets/d/1GV4Lwz2qa12M4SwGBb6XulyC0XnEFxqsGfmAG_dxlTA/edit?gid=1279187183
  // spreadsheetId: 1GV4Lwz2qa12M4SwGBb6XulyC0XnEFxqsGfmAG_dxlTA
  // googleId: 1279187183

  const spreadsheetId = sheetURL.match(/\/d\/(.*?)\//);
  const sheetId = sheetURL.match(/gid=(\d*)/);

  if (!spreadsheetId || !sheetId)
    throw new Error(
      'Google Sheets URL must include both a spreadsheetId and sheetId. See https://developers.google.com/workspace/sheets/api/guides/concepts for more information.',
    );

  return {
    fullUrl: sheetURL,
    spreadsheetId,
    sheetId,
  };
};
export const getUploadTemplate = async (type) => {
  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const googleAuthResponse = getAuth();

  const response = await fetchData({
    url: `${config.urls.cmsBase}/templates/${type}`,
    method: 'get',
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });

  return response.data;
};
