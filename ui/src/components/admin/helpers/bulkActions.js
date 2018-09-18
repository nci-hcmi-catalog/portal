// @ts-check

import { fetchData } from '../services/Fetcher';

export const bulkAction = async (url, method, data = []) => {
  if (!Array.isArray(data)) throw new Error('Data must be type Array');

  return fetchData({
    url,
    data,
    method,
    headers: '',
  });
};
