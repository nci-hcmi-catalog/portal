import { fetchData } from '../services/Fetcher';
import { getSheetObject } from '../helpers';

// async abstractions
export const getModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}?populate={"path": "variants.variant"}`,
    data: '',
    method: 'get',
  });

export const saveModel = async (baseUrl, values, isUpdate) => {
  const { name } = values;

  const url = isUpdate
    ? `${baseUrl}/model/${name}?populate={"path": "variants.variant"}`
    : `${baseUrl}/model`;

  return fetchData({
    url,
    data: values,
    method: isUpdate ? 'put' : 'post',
  });
};

export const deleteModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}`,
    data: '',
    method: 'delete',
  });

export const attachVariants = async (baseUrl, sheetURL, overwrite) => {
  const { spreadsheetId, sheetId } = getSheetObject(sheetURL);
  const uploadURL = `${baseUrl}/attach-variants/${spreadsheetId}/${sheetId}}?overwrite=${overwrite}`;
  const gapi = global.gapi;

  // TODO: this assumes user is already logged in - create a prompt to let user
  // know to login if not already logged in
  const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
  const googleAuthResponse = currentUser.getAuthResponse();

  return fetchData({
    url: uploadURL,
    data: '',
    method: 'get',
    headers: {
      Authorization: JSON.stringify(googleAuthResponse),
    },
  });
};
