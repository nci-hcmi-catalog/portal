let globals = ['VERSION', 'ES_HOST', 'ARRANGER_API'];

// TODO: || process.env[`REACT_APP_${val}`
export default globals.reduce(
  (acc, val) => ({
    ...acc,
    [val]: localStorage[val],
  }),
  { SEEN_WARNING_KEY: 'seen-warning' },
);
