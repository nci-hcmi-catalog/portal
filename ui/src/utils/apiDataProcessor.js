import moment from 'moment';

const processors = {
  date: value => moment(value).format('MMMM DD, YYYY'),
  boolean: value => (value ? 'Yes' : 'No'),
  keyword: value => `${value}`,
  long: value => value.toLocaleString(),
  short: value => value.toLocaleString(),
};

const isNullOrUndefined = value => value === null || typeof value === 'undefined';
const isEmptyByType = {
  date: value => isNullOrUndefined(value) || !value.length,
  boolean: isNullOrUndefined,
  keyword: value => isNullOrUndefined(value) || !value.length,
  long: isNullOrUndefined,
  short: isNullOrUndefined,
};

/**
 * If there is data process it, otherwise return
 * the characters "--" - our convention for no-data
 * @param {*} data - any of the below types
 * @param String type - date, boolean, keyword, long, short
 */
export default ({ data, type, unit }) => {
  return isEmptyByType[type || 'keyword'](data)
    ? 'N/A'
    : `${processors[type || 'keyword'](data)}${unit ? ` ${unit}` : ''}`;
};
