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
    method: isUpdate ? 'patch' : 'post',
  });
};

export const deleteModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}`,
    data: '',
    method: 'delete',
  });

export const attachVariants = async (baseUrl, sheetURL, overwrite, modelName) => {
  const { spreadsheetId, sheetId } = getSheetObject(sheetURL);
  const uploadURL = `${baseUrl}/attach-variants/${spreadsheetId}/${sheetId}/${modelName}?overwrite=${overwrite}`;
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

export const getOtherModelsList = async (baseUrl, modelName, select = []) => {
  const response = await fetchData({
    url: `${baseUrl}/model?skip=0&limit=1000&sort=name&select=${select.join(',')}`,
    data: '',
    method: 'get',
  });
  const otherModelsList =
    response.status === 200 ? response.data.filter((other) => other.name !== modelName) : [];
  return otherModelsList;
};

export const getMatchedModelSet = async (baseUrl, matchedModelId) => {
  return await fetchData({
    url: `${baseUrl}/matchedModels/${matchedModelId}?populate=models`,
    data: '',
    method: 'get',
  });
};

export const connectModelToSet = async (baseUrl, modelName, matchName) => {
  return await fetchData({
    url: `${baseUrl}/matches/connect/${modelName}`,
    data: { match: matchName },
    method: 'post',
  });
};

export const disconnectModelFromSets = async (baseUrl, modelName) => {
  return await fetchData({
    url: `${baseUrl}/matches/${modelName}`,
    data: '',
    method: 'delete',
  });
};
