import { random } from 'faker';

let fake = props => {
  return Object.entries(props).reduce(
    (p, [k, v]) => ({
      ...p,
      [k]: !v.__extensions && v.properties ? fake(v.properties) : v.__extensions.fake(v),
    }),
    {},
  );
};

let p = {
  date_of_availability: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    __extensions: {
      fake: obj => random.arrayElement(['2018-06-06 10:00:00']),
    },
  },
  clinical_diagnosis: {
    properties: {
      aquisition_site: {
        type: 'keyword',
        __extensions: {
          fake: () => 'lol',
        },
      },
    },
  },
};

test('x', () => {
  let p2 = fake(p);
  console.log(p2);

  expect(1).toBe(1);
});
