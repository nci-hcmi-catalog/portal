import fake from './mapping-faker';

let props = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  histopathological_biomarkers: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 2,
        max: 10,
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
      aquisition_site: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: 'lol',
        },
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
});

test('Creating a fake doc from mapping should not crash', () => {
  let result = fake(props());
  expect(result).toBeTruthy();
});
