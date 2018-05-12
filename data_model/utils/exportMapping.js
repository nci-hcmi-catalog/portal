import omitDeep from 'omit-deep';

export default ({ name, properties, settings }) => ({
  mappings: {
    [name]: {
      properties: omitDeep(properties, ['__extensions']),
    },
  },
  settings,
});
