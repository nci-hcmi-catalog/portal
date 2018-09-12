/**
 * This private function will extract all string and number values from
 * a multi-level deep object, returns each value in a flat array.
 * @param {Object} obj - Object to extract all string/number values from
 * @param {String} start - Starting string, should not be provided in initial call
 */
function objectValuesToArray(obj, start = []) {
  if (
    typeof obj === 'function' ||
    typeof obj === 'boolean' ||
    obj === null ||
    typeof obj === 'undefined'
  ) {
    // Ignore any non-object / null / undefined
    return start;
  } else if ((typeof obj === 'string' || typeof obj === 'number') && start.length > 0) {
    // If we have a string and start value return the concatenation of the two
    return start.concat(obj);
  } else if (typeof obj === 'string' || typeof obj === 'number') {
    // If this is our first string or number return it on it's own
    return [obj];
  } else {
    // // Nested objects/arrays will trigger recursion
    return (Array.isArray(obj) ? obj : Object.values(obj)).reduce(
      (acc, curr) => objectValuesToArray(curr, acc),
      start,
    );
  }
}

/**
 * Public function
 * @param {*} obj - Object to extract all string/number values from
 * @param {*} seperator - seperator to be used when flattening array
 */
function objectValuesToString(obj, seperator) {
  return objectValuesToArray(obj).join(seperator);
}

export default objectValuesToString;
