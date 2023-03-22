const dnaMethylationData = require('../data/molecularCharacterizations-03-21-23.json');
const dnaMethylationArrayData = require('../data/molecularCharacterizations-10-14-21.json');

module.exports = {
  up(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': dnaMethylationData,
        },
      },
    );
  },

  down(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': dnaMethylationArrayData,
        },
      },
    );
  },
};
