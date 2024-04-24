const newMolecularCharacterizations = require('../data/molecularCharacterizations-04-24-24.json');
const oldMolecularCharacterizations = require('../data/molecularCharacterizations-03-21-23.json');

module.exports = {
  up(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': newMolecularCharacterizations,
        },
      },
    );
  },

  down(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': oldMolecularCharacterizations,
        },
      },
    );
  },
};
