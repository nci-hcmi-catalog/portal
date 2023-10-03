const newExpressionOptionsData = require('../data/expressionOptions-23-10-02.json');
const oldExpressionOptionsData = require('../data/expressionOptions-23-01-06.json');

module.exports = {
  async up(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'variantExpressionLevel' },
      {
        $set: {
          'fields.$.values': newExpressionOptionsData,
        },
      },
    );
  },

  async down(db) {
    return db.collection('dictionary').updateMany(
      { 'fields.name': 'variantExpressionLevel' },
      {
        $set: {
          'fields.$.values': oldExpressionOptionsData,
        },
      },
    );
  },
};
