import { camelCase } from 'lodash';

/**
 * Creates a flat object from a nested object
 * Note: this implementation does not account for the possibility
 * of having nested keys that are the same, one would clober the other
 * but for our current application key brevity is the priority
 * (see function below for key safe alternative)
 * @param {Object} object - object to flatten
 * @returns {Object} - flat object containing all nested keys with values
 */
export default function deepFlattenObjNaive(object) {
  return Object.keys(object).reduce((acc, curr) => {
    if (typeof object[curr] == 'object') {
      return Object.assign(deepFlattenObj(object[curr]), acc);
    } else {
      acc[curr] = object[curr];
      return acc;
    }
  }, {});
}

/**
 * Given and object with nested objects, extract all nested
 * key/object pairs into a flat object - key names are generated for
 * nested objects to prevent conflicts
 * @param {Object} object - object to flatten
 * @param {String} prefix - prefix to add to flat key (comes from nesting key)
 */
function deepFlattenObj(object, prefix = '') {
  return Object.keys(object).reduce((acc, curr) => {
    if (typeof object[curr] == 'object') {
      return Object.assign(deepFlattenObj(object[curr], curr), acc);
    } else {
      acc[camelCase(`${prefix} ${curr}`)] = object[curr];
      return acc;
    }
  }, {});
}
