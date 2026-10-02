let globals = ['VERSION', 'ARRANGER_API'];

export default globals.reduce(
  (acc, val) => ({
    ...acc,
    [val]: localStorage[val] || import.meta.env[`REACT_APP_${val}`],
  }),
  { SEEN_WARNING_KEY: 'seen-warning' },
);
