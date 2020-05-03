module.exports = {
  up(db) {
    db.createCollection('dictionaryDraft').then(() =>
      db.collection('dictionaryDraft').createIndex({ name: 1 }, { unique: true }),
    );
  },

  down(db) {
    return db.collection('dictionaryDraft').drop();
  },
};
