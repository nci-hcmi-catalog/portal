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
        return Promise.all(
          data.map(({ name, type }) => db.collection('variants').findOne({ name, type })),
        );
      })
      .then(docsToRemove => {
        const idsToRemove = docsToRemove.map(({ _id }) => _id);
        return db
          .collection('variants')
          .deleteMany({ _id: { $in: idsToRemove } })
          .then(() => {
            db
              .collection('models')
              .updateMany({}, { $pull: { variants: { _id: { $in: idsToRemove } } } });
          });
      })
      .then(() => next())
      .catch(err => next(err));
  },
};
