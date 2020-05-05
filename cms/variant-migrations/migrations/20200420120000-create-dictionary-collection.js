module.exports = {
  up(db) {
    db.createCollection('dictionary');
  },

  down(db) {
    return db.collection('dictionary').drop();
  },
};
