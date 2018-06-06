/**
 * If there is data just return it, otherwise return
 * the characters "--" - our convention for no-data
 * @param {*} data - Any object, string, array, we are checking for content
 * @param {*} implicitReturn - Returns this instead of data if provided
 * data from api response
 */
export default function(data, implicitReturn = false) {
  return !data || data.length === 0 || isEmptyObject(data)
    ? '--'
    : implicitReturn
      ? implicitReturn
      : data;
}

function isEmptyObject(obj) {
  if (typeof obj !== 'object') {
    return false;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
}
