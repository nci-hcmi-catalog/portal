const loadDataFromCSV = require('../lib/loadDataFromCSV');

module.exports = {
  up(db) {
    return loadDataFromCSV('variants-18-09-07.csv').then(data =>
      db.collection('variants').insertMany(data),
    );
  },
  down(db, next) {
    loadDataFromCSV('variants-18-09-07.csv')
      .then(data => {
        const idsToRemove = data.map(({ _id }) => _id);
        return db
          .collection('variants')
          .deleteMany({ _id: { $in: idsToRemove } })
          .then(() => {
            db
              .collection('models')
              .updateMany({}, { $pull: { variants: { name: { $in: idsToRemove } } } });
          });
      })
      .then(() => next())
      .catch(err => next(err));
  },
};
