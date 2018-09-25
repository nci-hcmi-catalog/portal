// @ts-check

import { fetchData } from '../services/Fetcher';
import config from '../config';

export const singleAction = async (action, name = '') => {
  return fetchData({
    url: `${config.urls.cmsBase}/action/${action}/${name}`,
    data: '',
    method: 'post',
    headers: '',
  });
};
