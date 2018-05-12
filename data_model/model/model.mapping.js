let omitFaker = props => ({});

export let toEs = ({ name, properties, settings }) => ({
  mappings: {
    [name]: {
      properties: omitFaker(properties),
    },
  },
  settings,
});
