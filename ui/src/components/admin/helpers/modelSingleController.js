import { fetchData } from '../services/Fetcher';
import { getSheetObject } from '../helpers';

// Constants
export const modelStatus = {
  unpublished: 'unpublished',
  unpublishedChanges: 'unpublished changes',
  other: 'other',
  published: 'published',
};

export const isFormReadyToSave = (dirty, errors) => dirty && !('name' in errors);

export const isFormReadyToPublish = (values, dirty, errors) =>
  (values.status !== 'published' || dirty) && Object.keys(errors).length === 0;

export const computeModelStatus = (currentStatus, action) => {
  /*
    *  Matrix
    * -------------------------------------------
    *             |    save     |    publish    |
    * -------------------------------------------
    * unpublished | unpublished |   published   |
    * unpub. chgs | unpub. chgs |   published   |
    * other       | unpublished |   published   |
    * published   | unpub. chgs |   published   |
    * -------------------------------------------
  */

  const statusMatrix = {
    unpublished: {
      save: modelStatus.unpublished,
      publish: modelStatus.published,
    },
    unpublishedChanges: {
      save: modelStatus.unpublishedChanges,
      publish: modelStatus.published,
    },
    other: {
      save: modelStatus.unpublished,
      publish: modelStatus.published,
    },
    published: {
      save: modelStatus.unpublishedChanges,
      publish: modelStatus.published,
    },
  };

  const statusKey = Object.keys(modelStatus).find(key => modelStatus[key] === currentStatus);

  return currentStatus ? statusMatrix[statusKey][action] : modelStatus.unpublished;
};

// Add an id to notifications (ISO Datetime)
export const generateNotification = notification => ({
  ...notification,
  id: new Date().valueOf(),
});

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
