import { fetchData } from '../services/Fetcher';
import { makeOrDataQuery } from './queryFilters';

const sortQuery = sorted => (sorted.desc ? `-${sorted.id}` : `${sorted.id}`);
const paginatedUrl = ({ baseUrl, page, pageSize, filterValue, tableColumns, sorted }) =>
  (filterValue || '').length > 0
    ? `${baseUrl}?skip=${page * pageSize}&limit=${page * pageSize + pageSize}&sort=${sortQuery(
        sorted,
      )}&query=${makeOrDataQuery(tableColumns, filterValue)}`
    : `${baseUrl}?skip=${page * pageSize}&limit=${page * pageSize + pageSize}&sort=${sortQuery(
        sorted,
      )}`;

export const getPageData = ({ baseUrl, page, pageSize, filterValue, tableColumns, sorted }) => {
  let url = paginatedUrl({ baseUrl, page, pageSize, filterValue, tableColumns, sorted });
  return fetchData({ url, data: '', method: 'get' });
};

export const getCountData = ({ baseUrl, tableColumns, filterValue }) => {
  let url =
    (filterValue || '').length > 0
      ? `${baseUrl}?query=${makeOrDataQuery(tableColumns, filterValue)}`
      : `${baseUrl}`;
  return fetchData({ url, data: '', method: 'get' });
};
