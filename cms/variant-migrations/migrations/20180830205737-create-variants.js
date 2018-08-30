'use strict';

const variants = [
  {
    _id: 'testOne',
    type: 'example type',
    category: 'categoryOne',
    genes: ['KRAS', 'BRAF'],
    models: [],
  },
  {
    _id: 'testTwo',
    type: 'example type',
    category: 'categoryTwo',
    genes: ['KRAS', 'BRAF'],
    models: [],
  },
  {
    _id: 'testThree',
    type: 'example type',
    category: 'categoryThree',
    genes: ['KRAS', 'BRAF'],
    models: [],
  },
];

module.exports = {
  up(db) {
    return db.collection('variants').insertMany(variants);
  },
  // no down migration available
};
