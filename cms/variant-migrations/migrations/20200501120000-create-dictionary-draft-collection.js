module.exports = {
  up(db) {
    db.createCollection('dictionaryDraft');
  },

  down(db) {
    return db.collection('dictionaryDraft').drop();
  },
};
