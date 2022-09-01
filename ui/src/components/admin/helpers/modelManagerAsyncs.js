// @ts-check

import config from '../config';
import { get } from '../services/Fetcher';
import { getSheetObject } from '../helpers';
import { getAuth } from './googleAuth';

export const uploadModelsFromSheet = async (sheetURL, overwrite) => {
  const { spreadsheetId, sheetId } = getSheetObject(sheetURL);
  const uploadURL =
    config.urls.cmsBase + `/bulk-models/${spreadsheetId}/${sheetId}?overwrite=${overwrite}`;
  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const googleAuthResponse = getAuth();

  return get({
    url: uploadURL,
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
    params: '',
  });
};
