import { get, post } from './../../services/Fetcher';
import config from './../../config';

const PUBLISH_URL = `${config.urls.cmsBase}/publish`;

export const checkPublishStatus = async () => {
  return new Promise(async (resolve, reject) => {
    const url = `${PUBLISH_URL}/status`;
    await get({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const publish = async modelName => {
  const url = `${PUBLISH_URL}/${modelName}`;
  return post({ url });
};

export const publishBulk = async models => {
  const url = `${PUBLISH_URL}/bulk`;
  return post({
    url,
    data: {
      models,
      ids: true,
    },
  });
};

export const acknowledgePublishStatus = async modelName => {
  return new Promise(async (resolve, reject) => {
    const url = `${PUBLISH_URL}/acknowledge/${modelName}`;
    await post({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const acknowledgeBulkPublishStatus = async models => {
  return new Promise(async (resolve, reject) => {
    const url = `${PUBLISH_URL}/acknowledge/bulk`;
    await post({
      url,
      data: {
        models,
      },
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};

export const stopAllPublishes = async () => {
  return new Promise(async (resolve, reject) => {
    const url = `${PUBLISH_URL}/stop/all`;
    await post({ url })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response ? err.response.data.error : err);
      });
  });
};
