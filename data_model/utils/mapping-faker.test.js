import fake from './mapping-faker';
import actualMapping from '../model/properties.mapping';

let props = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  histopathological_biomarkers: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 2,
        max: 10,
        // cSpell:disable
        enum: [
          'EWSR1-PBX1',
          'EWSR1-ZNF444',
          'EWSR1-POU5F1',
          'CD99 positive',
          'RET rearranged',
          'PTEN negative',
        ],
      },
    },
  },
  date_of_availability: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['2018-06-06 10:00:00'],
    },
  },
  clinical_diagnosis: {
    properties: {
      acquisition_site: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: /[A-Z]{4}-[a-z]{4}/,
        },
      },
    },
  },
  genes: {
    type: 'nested',
    properties: {
      gene_symbol: {
        type: 'keyword',
      },
    },
  },
  files: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: { min: 1, max: 10 },
    },
    properties: {
      file_type: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: 'image',
        },
      },
    },
  },
  chemotherapeutic_drug_list_available: {
    type: 'boolean',
  },
});

test('Creating a fake doc from mapping should not crash', () => {
  let result = fake(props());
  expect(result).toBeTruthy();

  result = fake(actualMapping());
  expect(result).toBeTruthy();
});
