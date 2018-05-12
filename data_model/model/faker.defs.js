export default {
  days: {
    type: 'integer',
    minimum: 10,
    maximum: 10950,
    exclusiveMinimum: true,
  },
  daysToBirth: {
    type: 'integer',
    minimum: 10950,
    maximum: 36500,
    exclusiveMinimum: true,
  },
  age: {
    type: 'integer',
    minimum: 20,
    maximum: 100,
    exclusiveMinimum: true,
  },
  growthRate: {
    type: 'integer',
    minimum: 1,
    maximum: 90,
    exclusiveMinimum: false,
  },
};
