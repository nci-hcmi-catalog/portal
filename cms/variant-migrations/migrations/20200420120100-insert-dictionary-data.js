const constantsData = require('../data/constantsData-20-05-01.json');

module.exports = {
  up(db) {
    return db.collection('dictionary').insertMany(constantsData);
  },
  down(db, next) {
    db.collection('dictionary')
      .deleteMany({})
      .then(() => next())
      .catch(err => next(err));
  },
};
