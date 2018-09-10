module.exports = {
  up(db) {
    db
      .createCollection('variants')
      .then(() => db.collection('variants').createIndex({ name: 1, type: 1 }, { unique: true }));
  },

  down(db) {
    return db.collection('variants').drop();
  },
};
