import { fetchData } from '../services/Fetcher';
import { makeOrDataQuery } from './queryFilters';

const paginatedUrl = ({ baseUrl, page, pageSize, filterValue, tableColumns }) =>
  (filterValue || '').length > 0
    ? `${baseUrl}?skip=${0}&limit=${page * pageSize + pageSize}&query=${makeOrDataQuery(
        tableColumns,
        filterValue,
      )}`
    : `${baseUrl}?skip=${0}&limit=${page * pageSize + pageSize}`;

export const getPageData = ({ baseUrl, page, pageSize, filterValue, tableColumns }) => {
  debugger;
  let url = paginatedUrl({ baseUrl, page, pageSize, filterValue, tableColumns });
  return fetchData({ url, data: '', method: 'get' });
};
