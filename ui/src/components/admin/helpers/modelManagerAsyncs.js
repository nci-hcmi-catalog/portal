import config from '../config';
import { get } from '../services/Fetcher';
import { getSheetObject } from '../helpers';

export const uploadModelsFromSheet = async (sheetURL, overwrite) => {
  const { spreadsheetId, sheetId } = getSheetObject(sheetURL);
  const uploadURL =
    config.urls.cmsBase + `/sync-mongo/${spreadsheetId}/${sheetId}?overwrite=${overwrite}`;
  const gapi = global.gapi;
  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
  const googleAuthResponse = currentUser.getAuthResponse();

  return get({
    url: uploadURL,
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });
};
