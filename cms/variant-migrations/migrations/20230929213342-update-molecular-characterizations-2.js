// Using the same data for up and down since this is to fix a regression introduced by a devops rollback
// To revert to the "Array" version of the data, use 20230321213342-update-molecular-characterizations.js
const dnaMethylationData = require('../data/molecularCharacterizations-03-21-23.json');

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
          'fields.$.values': dnaMethylationData,
        },
      },
    );
  },
};
