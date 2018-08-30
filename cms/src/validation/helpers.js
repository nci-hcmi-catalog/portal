export const arrItemIsOneOf = options => values => {
  return values.reduce((acc, curr) => {
    if (acc === false) {
      return false;
    } else {
      return options.includes(curr);
    }
  }, true);
};
