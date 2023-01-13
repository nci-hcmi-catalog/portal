const OLD_NOT_DONE = 'Not Done';
const NEW_NOT_DONE = 'Not done';

module.exports = {
  async up(db) {
    return db
      .collection('models')
      .updateMany(
        { 'variants.expression_level': OLD_NOT_DONE },
        { $set: { 'variants.$[elem].expression_level': NEW_NOT_DONE } },
        { arrayFilters: [{ 'elem.expression_level': OLD_NOT_DONE }] },
      );
  },

  async down(db) {
    return db
      .collection('models')
      .updateMany(
        { 'variants.expression_level': NEW_NOT_DONE },
        { $set: { 'variants.$[elem].expression_level': OLD_NOT_DONE } },
        { arrayFilters: [{ 'elem.expression_level': NEW_NOT_DONE }] },
      );
  },
};
