// @ts-check

import { fetchData } from '../services/Fetcher';
import config from '../config';

export const bulkAction = async (action, data = []) => {
  if (!Array.isArray(data)) throw new Error('Data must be type Array');

  return fetchData({
    url: `${config.urls.cmsBase}/bulk/${action}`,
    data,
    method: 'post',
    headers: '',
  });
};
