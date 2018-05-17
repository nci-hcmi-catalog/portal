import { range, cond, isString, isNumber, isRegExp, mapValues } from 'lodash';
import { random } from 'faker';
import RandExp from 'randexp';

let traverse = ({
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
}) => {
  let conditions = [
    // nested
    [
      ([k, v]) => v.type === 'nested',
      ([k, v]) => {
        let minMax = v[EXTENSIONS_KEY]?.[FAKER_KEY];

        if (!minMax) {
          console.log(
            `⚠️  Field: ${k} \n
            No min-max range provided for nested field, defaulting to ${
              options.defaults.nested.min
            } - ${options.defaults.nested.max}`,
          );
        }

        return range(random.number(minMax || options.defaults.nested)).map(() =>
          traverse(v.properties),
        );
      },
    ],
    // object
    // NOTE: brittle.. extensions could be put on objects
    [([k, v]) => !v[EXTENSIONS_KEY] && v.properties, ([k, v]) => traverse(v.properties)],
    // from a list
    [
      ([k, v]) => v[EXTENSIONS_KEY] && Array.isArray(v[EXTENSIONS_KEY][FAKER_KEY]),
      ([k, v]) => random.arrayElement(v[EXTENSIONS_KEY][FAKER_KEY]),
    ],
    // array of primitives
    // TODO: doesn't *have* to contain an enum...
    [
      ([k, v]) => v[EXTENSIONS_KEY] && v[EXTENSIONS_KEY][FAKER_KEY].enum,
      ([k, v]) =>
        range(random.number(v[EXTENSIONS_KEY][FAKER_KEY])).map(() =>
          random.arrayElement(v[EXTENSIONS_KEY][FAKER_KEY].enum),
        ),
    ],
    // regex
    [
      ([k, v]) => v[EXTENSIONS_KEY] && isRegExp(v[EXTENSIONS_KEY][FAKER_KEY]),
      ([k, v]) => new RandExp(v[EXTENSIONS_KEY][FAKER_KEY]).gen(),
    ],
    // number with range
    // TODO: be less lazy
    [
      ([k, v]) => v[EXTENSIONS_KEY] && v[EXTENSIONS_KEY][FAKER_KEY].min,
      ([k, v]) => random.number(v[EXTENSIONS_KEY][FAKER_KEY]),
    ],
    // primitive
    [
      ([k, v]) =>
        v[EXTENSIONS_KEY] &&
        (isNumber(v[EXTENSIONS_KEY][FAKER_KEY]) || isString(v[EXTENSIONS_KEY][FAKER_KEY])),
      ([k, v]) => v[EXTENSIONS_KEY][FAKER_KEY],
    ],

    // boolean
    [v => v.type === 'boolean', random.boolean],
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
