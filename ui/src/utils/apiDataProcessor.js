import moment from 'moment';

function isEmptyObject(obj) {
  if (typeof obj !== 'object') {
    return false;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
}

const processors = {
  date: value => moment(value).format('DD/MM/YYYY'),
  boolean: value => (value ? 'Yes' : 'No'),
  keyword: value => `${value}`,
  long: value => value.toLocaleString(),
  short: value => value.toLocaleString(),
};

/**
 * If there is data process it, otherwise return
 * the characters "--" - our convention for no-data
 * @param {*} data - Any object, string, array, we are checking for content
 * @param String displayType - date, boolean, keyword, long, url
 */
export default ({ data, type, unit }) =>
  (type !== 'boolean' && !data) || data.length === 0 || isEmptyObject(data)
    ? '--'
    : `${processors[type || 'keyword'](data)}${unit ? ` ${unit}` : ''}`;
