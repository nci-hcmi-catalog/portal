const OLD_PARENT_TUMOR = 'DNA Methylation Array of parent tumor';
const NEW_PARENT_TUMOR = 'DNA Methylation of parent tumor';

module.exports = {
  async up(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: OLD_PARENT_TUMOR },
        { $set: { 'molecular_characterizations.$': NEW_PARENT_TUMOR } },
      );
  },

  async down(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: NEW_PARENT_TUMOR },
        { $set: { 'molecular_characterizations.$': OLD_PARENT_TUMOR } },
      );
  },
};
