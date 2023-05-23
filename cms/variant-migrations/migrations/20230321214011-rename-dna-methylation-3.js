const OLD_MODEL = 'DNA Methylation Array of model';
const NEW_MODEL = 'DNA Methylation of model';

module.exports = {
  async up(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: OLD_MODEL },
        { $set: { 'molecular_characterizations.$': NEW_MODEL } },
      );
  },

  async down(db) {
    return db
      .collection('models')
      .updateMany(
        { molecular_characterizations: NEW_MODEL },
        { $set: { 'molecular_characterizations.$': OLD_MODEL } },
      );
  },
};
