module.exports = {
  up(db) {
    db.createCollection('dictionary').then(() =>
      db.collection('dictionary').createIndex({ name: 1 }, { unique: true }),
    );
  },

  down(db) {
    return db.collection('dictionary').drop();
  },
};
