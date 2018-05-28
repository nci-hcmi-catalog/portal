import { range, cond, isString, isNumber, isRegExp, set } from 'lodash';
import { random } from 'faker';
import RandExp from 'randexp';

let traverse = (
  {
    EXTENSIONS_KEY = '__extensions',
    FAKER_KEY = 'faker',
    options = {
      defaults: {
        nested: {
          min: 2,
          max: 5,
        },
      },
    },
    ...props
  },
  { path = [], context = {} } = {},
) => {
  let val = v => v[EXTENSIONS_KEY]?.[FAKER_KEY];

  let conditions = [
    // for debugging
    ...(!process.env.TRACE
      ? []
      : [
          [
            ([k, v]) => {
              console.log('trace', [...path, k]);
              console.log('context', context);
              return false;
            },
            () => {},
          ],
        ]),
    // nested
    [
      ([k, v]) => v.type === 'nested',
      ([k, v]) => {
        let minMax = val(v);

        if (!minMax) {
          console.log(
            `⚠️  Field: ${k} \n
            No min-max range provided for nested field, defaulting to ${
              options.defaults.nested.min
            } - ${options.defaults.nested.max}`,
          );
        }

        let output = range(random.number(minMax || options.defaults.nested)).map(index =>
          traverse(v.properties, { path: [...path, k, index], context }),
        );

        set(context, [...path, k], output);
        return output;
      },
    ],
    // object
    // NOTE: brittle.. extensions could be put on objects
    [
      ([k, v]) => !val(v) && v.properties,
      ([k, v]) => {
        let output = traverse(v.properties, { path: [...path, k], context });
        set(context, [...path, k], output);
        return output;
      },
    ],
    // from a list
    [
      ([k, v]) =>
        val(v) &&
        ((typeof val(v) === 'function' && Array.isArray(val(v)({ path, context }))) ||
          Array.isArray(val(v))),
      ([k, v]) => {
        let output =
          typeof val(v) === 'function'
            ? random.arrayElement(val(v)({ path, context }))
            : random.arrayElement(val(v));

        set(context, [...path, k], output);
        return output;
      },
    ],
    // array of primitives
    // TODO: doesn't *have* to contain an enum...
    [
      ([k, v]) => val(v)?.enum,
      ([k, v]) => {
        let output = range(random.number(val(v))).map(() => random.arrayElement(val(v).enum));

        set(context, [...path, k], output);
        return output;
      },
    ],
    // regex
    [
      ([k, v]) => isRegExp(val(v)),
      ([k, v]) => {
        let output = new RandExp(val(v)).gen();
        set(context, [...path, k], output);
        return output;
      },
    ],
    // number with range
    // TODO: be less lazy
    [
      ([k, v]) => val(v)?.min,
      ([k, v]) => {
        let output = random.number(val(v));
        set(context, [...path, k], output);
        return output;
      },
    ],
    // primitive
    [
      ([k, v]) => isNumber(val(v)) || isString(val(v)),
      ([k, v]) => {
        let output = val(v);
        set(context, [...path, k], output);
        return output;
      },
    ],

    // boolean
    [
      ([k, v]) => v.type === 'boolean',
      ([k]) => {
        let output = random.boolean();

        set(context, [...path, k], output);
        return output;
      },
    ],
  ];

  return Object.entries(props).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: cond(conditions)([k, v]),
    }),
    {},
  );
};

export default traverse;
