// @ts-check

import { get, capitalize } from 'lodash';
import objectValuesToString from './objectValuesToString';

const modelReducer = result => (acc, curr) => {
  if (acc.length === 0 && result[curr].length === 0) {
    // First time, zero variant data in the key
    return `${capitalize(curr)}: 0`;
  } else if (acc.length === 0 && result[curr].length > 0) {
    // First time if there is variant data in the key
    return `${capitalize(curr)}: ${result[curr].length}`;
  } else if (result[curr].length > 0) {
    // All subsequent if there is data in the key
    return `${acc} | ${capitalize(curr)}: ${result[curr].length}`;
  } else {
    // Else return zero result
    return `${acc} | ${capitalize(curr)}: 0`;
  }
};

const variantReducer = result => (acc, curr) => {
  if (acc.length === 0 && result[curr].length === 0) {
    // First time, zero variant data in the key
    return `${capitalize(curr)}: 0`;
  } else if (acc.length === 0 && curr === 'errors') {
    // First time if there is errors data (special case)
    return `${capitalize(curr)}: ${result[curr].length}`;
  } else if (result[curr].length > 0 && curr === 'errors') {
    // Non-first and key is errors (special case)
    return `${acc} | ${capitalize(curr)}: ${result[curr].length}`;
  } else if (acc.length === 0 && result[curr].length > 0) {
    // First time if there is variant data in the key
    return `${capitalize(curr)}: ${result[curr][0]['variants'].length}`;
  } else if (result[curr].length > 0) {
    // All subsequent if there is data in the key
    return `${acc} | ${capitalize(curr)}: ${result[curr][0]['variants'].length}`;
  } else {
    // Else return zero result
    return `${acc} | ${capitalize(curr)}: 0`;
  }
};

const reduceResult = (result, type) =>
  type === 'variant' ? variantReducer(result) : modelReducer(result);

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
