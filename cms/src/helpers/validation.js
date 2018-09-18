// @ts-check

export const runYupValidators = (validator, data) => {
  const validatePromises = data.map(p =>
    validator.validate(p, { abortEarly: false }).catch(Error => Error),
  );

  return Promise.all(validatePromises).then(results => {
    const failed = results.filter(result => result instanceof Error);
    if (failed.length > 0) {
      const errors = {
        validationErrors: failed.map(({ value, inner }) => ({
          errors: inner.reduce(
            (acc, { path, message }) => ({
              ...acc,
              [path]: message,
            }),
            {},
          ),
          value,
        })),
      };
      throw errors;
    }
    return data;
  });
};
