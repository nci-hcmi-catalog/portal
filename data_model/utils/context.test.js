import { get } from 'lodash';
import fake from './mapping-faker';

let props = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  genes: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 1,
        max: 1,
      },
    },
    properties: {
      gene_symbol: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['BRAF'],
        },
      },
      variants: {
        type: 'nested',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 1,
            max: 1,
          },
        },
        properties: {
          clinical_sequencing: {
            type: 'nested',
            [EXTENSIONS_KEY]: {
              [FAKER_KEY]: {
                min: 1,
                max: 1,
              },
            },
            properties: {
              name: {
                type: 'keyword',
                [EXTENSIONS_KEY]: {
                  [FAKER_KEY]: ({ path, context }) => {
                    let { gene_symbol } = get(context, path.slice(0, 2));
                    return [`${gene_symbol}-F1174L`];
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

let expected = {
  genes: [
    {
      gene_symbol: 'BRAF',
      variants: [
        {
          clinical_sequencing: [
            {
              name: 'BRAF-F1174L',
            },
          ],
        },
      ],
    },
  ],
};

test('Path and context is passed properly', () => {
  let result = fake(props());
  expect(result).toEqual(expected);
});
