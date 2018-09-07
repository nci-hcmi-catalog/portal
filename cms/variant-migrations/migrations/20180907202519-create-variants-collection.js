module.exports = {
  up(db) {
    return db.createCollection('variants');
  },

  down(db) {
    return db.collection('variants').drop();
  },
};
