import { get } from 'lodash';
import fake from './mapping-faker';
import actualMapping from '../model/properties.mapping';

let props = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  genes: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 2,
        max: 5,
      },
    },
    properties: {
      gene_symbol: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['BRAF', 'KRAS', 'TP53'],
        },
      },
      variants: {
        type: 'nested',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 2,
            max: 5,
          },
        },
        properties: {
          clinical_sequencing: {
            type: 'nested',
            [EXTENSIONS_KEY]: {
              [FAKER_KEY]: {
                min: 2,
                max: 5,
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

test('Path and context is passed properly', () => {
  let result = fake(props());
  result.genes.forEach(gene => {
    gene.variants.forEach(variant => {
      variant.clinical_sequencing.forEach(cs => {
        expect(cs.name).toEqual(`${gene.gene_symbol}-F1174L`);
      });
    });
  });
});

// NOTE: brittle! test will break if mapping shape changes
test('Actual mapping variant.clinical_sequencing.name contains parent gene.gene_symbol', () => {
  let result = fake(actualMapping());
  result.genes.forEach(gene => {
    gene.variants.forEach(variant => {
      variant.clinical_sequencing.forEach(cs => {
        expect(cs.name.includes(gene.gene_symbol)).toBeTruthy();
      });
    });
  });
});
