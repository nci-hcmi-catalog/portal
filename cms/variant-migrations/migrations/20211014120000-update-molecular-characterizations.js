const dnaMethylationArrayData = require('../data/molecularCharacterizations-10-14-21.json');
const targetedSeqData = require('../data/molecularCharacterizations-10-13-21-backup.json');

module.exports = {
  up(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': dnaMethylationArrayData,
        },
      },
    );
  },

  down(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': targetedSeqData,
        },
      },
    );
  },
};
