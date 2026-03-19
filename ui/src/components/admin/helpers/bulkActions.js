// @ts-check
import axios, { AxiosHeaders } from 'axios';
import { fetchData } from '../services/Fetcher';
import config from '../config';

export const bulkAction = async (action, data = []) => {
  if (!Array.isArray(data)) throw new Error('Data must be type Array');
  // Fixes 'header name must be a non-empty string' errors
  const defaultHeaders = new AxiosHeaders(new axios.AxiosHeaders().toJSON());
  return fetchData({
    url: `${config.urls.cmsBase}/bulk/${action}`,
    data,
    method: 'post',
    headers: defaultHeaders,
  });
};
