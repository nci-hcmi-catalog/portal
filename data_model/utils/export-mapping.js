import { cloneDeep } from 'lodash';
import omitDeep from 'omit-deep';

export default ({ EXTENSIONS_KEY = '__extensions', name, properties, settings }) => ({
  mappings: {
    [name]: {
      properties: omitDeep(cloneDeep(properties), [EXTENSIONS_KEY]),
    },
  },
  settings,
});
