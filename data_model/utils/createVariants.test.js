import createVariants from './createVariants';

let models = [
  {
    id: 1,
    variants: [
      {
        category: 'cat A',
        name: 'name A',
      },
      {
        category: 'cat A',
        name: 'name B',
      },
    ],
  },
  {
    id: 2,
    variants: [
      {
        category: 'cat A',
        name: 'name A',
      },
      {
        category: 'cat B',
        name: 'name B',
      },
    ],
  },
];

let expected = [
  {
    variant_id: 'cat A-name A',
    category: 'cat A',
    name: 'name A',
    models: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  },
  {
    variant_id: 'cat A-name B',
    category: 'cat A',
    name: 'name B',
    models: [
      {
        id: 1,
      },
    ],
  },
  {
    variant_id: 'cat B-name B',
    category: 'cat B',
    name: 'name B',
    models: [
      {
        id: 2,
      },
    ],
  },
];

test('Variants contain correct models', () => {
  let result = createVariants(models);

  expect(result).toEqual(expected);
});
