const constantsData = require('../data/constantsData-20-04-20.json');

module.exports = {
  up(db) {
    return db.collection('dictionary').insertMany(constantsData);
  },
  down(db, next) {
    db.collection('dictionary')
      .findAll()
      .then(docsToRemove => {
        const idsToRemove = docsToRemove.map(({ _id }) => _id);
        return db.collection('dictionary').deleteMany({ _id: { $in: idsToRemove } });
      });
  },
};
