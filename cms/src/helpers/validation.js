// @ts-check

import { ValidationError } from 'yup';

export const runYupValidatorFailSlow = (validator, data) => {
  const validatePromises = data.map(p =>
    validator.validate(p, { abortEarly: false }).catch(Error => Error),
  );

  return Promise.all(validatePromises).then(results =>
    results.map(result => {
      if (!(result instanceof ValidationError)) {
        return {
          success: true,
          result,
        };
      } else {
        return {
          success: false,
          errors: {
            // Name will be one of:
            // name (model upload)
            // variant_name (variant upload)
            // First key in object (all other cases)
            // Unknown (fallback)
            name:
              result.value.name ||
              result.value.variant_name ||
              result.value[Object.keys(result.value)[0]] ||
              'Unknown',
            details: getErrorDetails(result),
          },
        };
      }
    }),
  );
};

export const runYupValidatorFailFast = (validator, data) => {
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
              [path]: `${path}: ${message}`,
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

const getErrorDetails = validationResult =>
  validationResult.inner.flatMap(({ errors, path }) => errors.map(error => `${path}: ${error}`));
