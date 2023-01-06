const expressionOptionsData = require('../data/expressionOptions-23-01-06.json');

module.exports = {
  async up(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'variantExpressionLevel' },
      {
        $push: {
          'fields.$.values': expressionOptionsData,
        },
      },
    );
  },

  async down(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'variantExpressionLevel' },
      {
        $pullAll: {
          'fields.$.values': expressionOptionsData,
        },
      },
    );
  },
};
