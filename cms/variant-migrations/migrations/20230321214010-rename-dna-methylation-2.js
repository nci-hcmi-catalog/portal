const OLD_NORMAL = 'DNA Methylation Array of normal';
const NEW_NORMAL = 'DNA Methylation of normal';

module.exports = {
  async up(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: OLD_NORMAL },
        { $set: { 'molecular_characterizations.$': NEW_NORMAL } },
      );
  },

  async down(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: NEW_NORMAL },
        { $set: { 'molecular_characterizations.$': OLD_NORMAL } },
      );
  },
};
