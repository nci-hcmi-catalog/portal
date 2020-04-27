import { omit } from 'lodash';
import deepFlattenObj from 'utils/deepFlattenObj';

export default function modelExportProcessor(model) {
  // remove unneeded fields
  model = omit(model, ['id', 'files']);

  // flatten the object
  model = deepFlattenObj(model);

  // process exports for nested fields or fields that are not strings
  Object.entries(model).forEach(([key, val]) => {
    if (typeof val === 'number') {
      model[key] = val.toString();
    } else if (typeof val === 'boolean') {
      model[key] = val ? 'Yes' : 'No';
    } else if (val instanceof Array) {
      model[key] = val.join(', ');
    }
  });

  model = omit(model, ['edges']);
  // return processed model
  return model;
}
