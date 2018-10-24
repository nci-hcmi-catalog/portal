import { trimEnd } from 'lodash';
import { filters } from '@hcmi-portal/cms/src/helpers/dataFilters';

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
