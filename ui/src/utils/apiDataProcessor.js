import moment from 'moment';
import { isEmpty } from 'lodash';

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
 * @param String displayType - date, boolean, keyword, long
 */
export default ({ data, type, unit }) =>
  (type !== 'boolean' && !data) || data.length === 0 || isEmpty(data)
    ? '--'
    : `${processors[type || 'keyword'](data)}${unit ? ` ${unit}` : ''}`;
