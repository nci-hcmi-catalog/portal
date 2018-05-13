import exportMapping from './export-mapping';

let properties = ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  age_at_diagnosis: {
    type: 'long',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: { min: 10, max: 10950 },
    },
  },
});

let validMapping = {
  mappings: {
    model_test: {
      properties: {
        age_at_diagnosis: {
          type: 'long',
        },
      },
    },
  },
  settings: {},
};

test('Mapping transformed correctly (faker keys removed)', () => {
  let mapping = exportMapping({
    name: 'model_test',
    properties: properties(),
    settings: {},
  });

  expect(mapping).toEqual(validMapping);
});
