import { range, cond, isString, isNumber, isRegExp } from 'lodash';
import { random } from 'faker';
import RandExp from 'randexp';

let traverse = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker', ...props }) => {
  let conditions = [
    // nested
    [
      v => v.type === 'nested',
      v => range(random.number(v[EXTENSIONS_KEY][FAKER_KEY])).map(() => traverse(v.properties)),
    ],
    // object
    // NOTE: brittle.. extensions could be put on objects
    [v => !v[EXTENSIONS_KEY] && v.properties, v => traverse(v.properties)],
    // from a list
    [
      v => v[EXTENSIONS_KEY] && Array.isArray(v[EXTENSIONS_KEY][FAKER_KEY]),
      v => random.arrayElement(v[EXTENSIONS_KEY][FAKER_KEY]),
    ],
    // array of primitives
    // TODO: doesn't *have* to contain an enum...
    [
      v => v[EXTENSIONS_KEY] && v[EXTENSIONS_KEY][FAKER_KEY].enum,
      v =>
        range(random.number(v[EXTENSIONS_KEY][FAKER_KEY])).map(() =>
          random.arrayElement(v[EXTENSIONS_KEY][FAKER_KEY].enum),
        ),
    ],
    // regex
    [
      v => v[EXTENSIONS_KEY] && isRegExp(v[EXTENSIONS_KEY][FAKER_KEY]),
      v => new RandExp(v[EXTENSIONS_KEY][FAKER_KEY]).gen(),
    ],
    // number with range
    // TODO: be less lazy
    [
      v => v[EXTENSIONS_KEY] && v[EXTENSIONS_KEY][FAKER_KEY].min,
      v => random.number(v[EXTENSIONS_KEY][FAKER_KEY]),
    ],
    // primitive
    [
      v =>
        v[EXTENSIONS_KEY] &&
        (isNumber(v[EXTENSIONS_KEY][FAKER_KEY]) || isString(v[EXTENSIONS_KEY][FAKER_KEY])),
      v => v[EXTENSIONS_KEY][FAKER_KEY],
    ],

    // boolean
    [v => v.type === 'boolean', random.boolean],
  ];

  return Object.entries(props).reduce((p, [k, v]) => {
    return {
      ...p,
      [k]: cond(conditions)(v),
    };
  }, {});
};

export default traverse;
