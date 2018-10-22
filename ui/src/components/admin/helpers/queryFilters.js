import { trimEnd, isNaN, toNumber } from 'lodash';

export const filters = {
  startsWith: (colAccessor, filterValue) => `{"${colAccessor}":{"$regex":"(?i)^(${filterValue})"}}`,
  includes: (colAccessor, filterValue) =>
    `{"${colAccessor}":{"$regex":"(?i).*(${filterValue}).*"}}`,
  // because mongodb date comparison doesn't work if there is a character in the value
  date: (colAccessor, filterValue) =>
    `{"${colAccessor}":{"$eq":"${isNaN(toNumber(filterValue)) ? '' : filterValue}"}}`,
};

const makeDataQuery = (cols, filterValue) =>
  (filterValue || '').length > 0
    ? cols.reduce(
        // either use column specific filter function or default filter function(i.e.includes) to form query string
        (output, col) =>
          output + (col.queryFilter || filters.includes)(col.accessor, filterValue) + ',',
        '',
      )
    : '';

export const makeAndDataQuery = (cols, filterValue) =>
  (filterValue || '').length > 0
    ? // a valid query filter looks like: {"$and":[{"status":{"$regex":"^(pub)"}},{"name":{"$regex":".*(hcm).*"}}]}
      `{"$and":[${trimEnd(makeDataQuery(cols, filterValue), ',')}]}`
    : '';

export const makeOrDataQuery = (cols, filterValue) =>
  (filterValue || '').length > 0
    ? // a valid query filter looks like: {"$or":[{"status":{"$regex":"^(pub)"}},{"name":{"$regex":".*(hcm).*"}}]}
      `{"$or":[${trimEnd(makeDataQuery(cols, filterValue), ',')}]}`
    : '';
