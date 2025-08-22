let globals = ['VERSION', 'ES_HOST', 'ARRANGER_API'];

// || process.env[`REACT_APP_${val}`
console.log(import.meta.env);
export default globals.reduce(
  (acc, val) => ({
    ...acc,
    [val]: localStorage[val],
  }),
  { SEEN_WARNING_KEY: 'seen-warning' },
);
