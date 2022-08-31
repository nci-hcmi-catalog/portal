import moment from 'moment-timezone';

const processor = (type = 'keyword', unit) =>
  ({
    date: value => `${moment(value).format('MMMM DD, YYYY')}${unit}`,
    boolean: value => (value ? 'Yes' : 'No'),
    keyword: value =>
      Array.isArray(value) ? value.map(val => `${val}${unit}`) : `${value}${unit}`,
    long: value => `${value.toLocaleString()}${unit}`,
    short: value => `${value.toLocaleString()}${unit}`,
  }[type]);

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
const apiDataProcessor = ({ data, type, unit }) => {
  return isEmptyByType[type || 'keyword'](data) ? 'N/A' : processor(type, unit || '')(data);
};

export default apiDataProcessor;
