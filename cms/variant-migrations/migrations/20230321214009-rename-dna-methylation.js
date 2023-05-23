const OLD_PARENT_TUMOR = 'DNA Methylation Array of parent tumor';
const NEW_PARENT_TUMOR = 'DNA Methylation of parent tumor';
const OLD_NORMAL = 'DNA Methylation Array of normal';
const NEW_NORMAL = 'DNA Methylation of normal';
const OLD_MODEL = 'DNA Methylation Array of model';
const NEW_MODEL = 'DNA Methylation of model';

module.exports = {
  async up(db) {
    return await Promise.all([
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: OLD_PARENT_TUMOR },
          { $set: { 'molecular_characterizations.$': NEW_PARENT_TUMOR } },
        ),
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: OLD_NORMAL },
          { $set: { 'molecular_characterizations.$': NEW_NORMAL } },
        ),
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: OLD_MODEL },
          { $set: { 'molecular_characterizations.$': NEW_MODEL } },
        ),
    ]);
  },

  async down(db) {
    return await Promise.all([
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: NEW_PARENT_TUMOR },
          { $set: { 'molecular_characterizations.$': OLD_PARENT_TUMOR } },
        ),
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: NEW_NORMAL },
          { $set: { 'molecular_characterizations.$': OLD_NORMAL } },
        ),
      await db
        .collection('models')
        .updateMany(
          { molecular_characterizations: NEW_MODEL },
          { $set: { 'molecular_characterizations.$': OLD_MODEL } },
        ),
    ]);
  },
};
