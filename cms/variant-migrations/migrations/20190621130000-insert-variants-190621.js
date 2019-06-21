const loadDataFromCSV = require('../lib/loadDataFromCSV');

module.exports = {
  up(db) {
    return loadDataFromCSV('variants-19-06-21.csv').then(data =>
      data.forEach(row => {
        db
          .collection('variants')
          .updateOne({ name: row.name, type: row.type }, { $set: row }, { upsert: true });
      }),
    );
  },
  down(db, next) {
    loadDataFromCSV('variants-19-06-21.csv')
      .then(data => {
        return Promise.all(
          data.map(({ name, type }) => db.collection('variants').findOne({ name, type })),
        );
      })
      .then(docsToRemove => {
        if (docsToRemove[0]) {
          const idsToRemove = docsToRemove.map(({ _id }) => _id);
          return db
            .collection('variants')
            .deleteMany({ _id: { $in: idsToRemove } })
            .then(() => {
              db
                .collection('models')
                .updateMany({}, { $pull: { variants: { _id: { $in: idsToRemove } } } });
            });
        }
      })
      .then(() => next())
      .catch(err => next(err));
  },
};
