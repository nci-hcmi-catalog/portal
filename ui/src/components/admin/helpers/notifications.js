// @ts-check

import { get, capitalize } from 'lodash';
import objectValuesToString from './objectValuesToString';

const printResult = (type, curr, count) =>
  curr === 'errors'
    ? `${count} ${type}s with ${capitalize(curr)}`
    : `${count} ${capitalize(curr)} ${type}s`;

const reduceResult = (result, type) => (acc, curr) => {
  if (acc.length === 0 && result[curr].length === 0) {
    // First time, zero variant data in the key
    return printResult(type, curr, 0);
  } else if (acc.length === 0 && result[curr].length > 0) {
    // First time if there is variant data in the key
    return printResult(type, curr, result[curr].length);
  } else if (result[curr].length > 0) {
    // All subsequent if there is data in the key
    return `${acc} | ${printResult(type, curr, result[curr].length)}`;
  } else {
    // Else return zero result
    return `${acc} | ${printResult(type, curr, 0)}`;
  }
};

export function extractResultText(result, type = 'model') {
  const customSortMatrix = {
    new: 1,
    updated: 2,
    unchanged: 3,
    error: 4,
  };

  const sortedKeys = Object.keys(result).sort((a, b) => customSortMatrix[a] - customSortMatrix[b]);

  return sortedKeys.reduce(reduceResult(result, type), '');
}

export function extractErrorText(err) {
  return objectValuesToString(
    get(err, 'response.data.error.validationErrors[0].errors', get(err, 'response.data.error', {})),
    '; ',
  );
}

/*
 if all values are empty that means no updates were done - termed as empty result set
*/
export function isEmptyResult(result) {
  return result.new &&
    result.new.length === 0 &&
    result.updated &&
    result.updated.length === 0 &&
    result.unchanged &&
    result.unchanged.length === 0 &&
    result.errors &&
    result.errors.length === 0
    ? true
    : false;
}
