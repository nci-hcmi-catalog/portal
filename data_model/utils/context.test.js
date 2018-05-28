import { get } from 'lodash';
import fake from './mapping-faker';

let props = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  variants: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 2,
        max: 5,
      },
    },
    properties: {
      genes: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 1,
            max: 2,
            enum: ['BRAF', 'KRAS'],
          },
        },
      },
      name: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ({ path, context }) => {
            let { genes } = get(context, path);
            return [`${genes}-F1174L`];
          },
        },
      },
    },
  },
});

test('Path and context is passed properly', () => {
  let result = fake(props());
  result.variants.forEach(v => expect(v.name.includes(v.genes[0])).toBeTruthy());
});
