import { isNaN, toNumber } from 'lodash';

export const filters = {
  startsWith: (colAccessor, filterValue) => `{"${colAccessor}":{"$regex":"(?i)^(${filterValue})"}}`,
  includes: (colAccessor, filterValue) =>
    `{"${colAccessor}":{"$regex":"(?i).*(${filterValue}).*"}}`,
  // because mongodb date comparison doesn't work if there is a character in the value
  date: (colAccessor, filterValue) =>
    `{"${colAccessor}":{"$eq":"${isNaN(toNumber(filterValue)) ? '' : filterValue}"}}`,
};
