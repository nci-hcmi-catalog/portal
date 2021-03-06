// @ts-check

import { get, capitalize } from 'lodash';
import objectValuesToString from './objectValuesToString';

const printResult = (type, curr, count) =>
  curr === 'errors'
    ? `${count} ${capitalize(type)}s with ${curr}`
    : `${count} ${capitalize(curr)} ${type}s`;

const modelReducer = (result, type) => (acc, curr) => {
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

const variantReducer = (result, type) => (acc, curr) => {
  if (acc.length === 0 && result[curr].length === 0) {
    // First time, zero variant data in the key
    return printResult(type, curr, 0);
  } else if (acc.length === 0 && curr === 'errors') {
    // First time if there is errors data (special case)
    return printResult(type, curr, result[curr].length);
  } else if (result[curr].length > 0 && curr === 'errors') {
    // Non-first and key is errors (special case)
    return `${acc} | ${printResult(type, curr, result[curr].length)}`;
  } else if (acc.length === 0 && result[curr].length > 0) {
    // First time if there is variant data in the key
    return printResult(type, curr, result[curr][0]['variants'].length);
  } else if (result[curr].length > 0) {
    // All subsequent if there is data in the key
    return `${acc} | ${printResult(type, curr, result[curr][0]['variants'].length)}`;
  } else {
    // Else return zero result
    return `${acc} | ${printResult(type, curr, 0)}`;
  }
};

const reduceResult = (result, type) =>
  type === 'variant' ? variantReducer(result, type) : modelReducer(result, type);

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

export const isEqual = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }

  let sorted1 = arr1.sort();
  let sorted2 = arr2.sort();

  for (let i = 0; i < arr1.length; i++) {
    if (sorted1[i] !== sorted2[i]) {
      return false;
    }
  }

  return true;
};
