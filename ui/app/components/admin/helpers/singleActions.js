// @ts-check

import { fetchData } from '../services/Fetcher';
import config from '../config';

export const singleAction = async (action, name = '') => {
  const url =
    config.urls.cmsBase + (action === 'delete' ? `/model/${name}` : `/action/${action}/${name}`);
  return fetchData({
    url,
    data: '',
    method: action === 'delete' ? 'delete' : 'post',
    headers: '',
  });
};
