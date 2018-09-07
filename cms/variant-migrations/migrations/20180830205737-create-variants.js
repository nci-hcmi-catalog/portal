'use strict';

const source = [
  {
    _id: 'testOne',
    type: 'example type',
    category: 'categoryOne',
    genes: ['KRAS', 'BRAF'],
  },
  {
    _id: 'testTwo',
    type: 'example type',
    category: 'categoryTwo',
    genes: ['KRAS', 'BRAF'],
  },
  {
    _id: 'testThree',
    type: 'example type',
    category: 'categoryThree',
    genes: ['KRAS', 'BRAF'],
  },
];

/**
 * Until we begin managing the variants using the CMS we will rely on
 * these basic migrations. Functionality is very limited here. Essentially
 * you can only insert and remove variants. Removing them will search the
 * models collection for any relationship entry and remove it for the same
 * list that added.
 *
 * To add additonal variants create a new via 'migrate-mongo create NAME_OF_MIGRATION'
 * and the copy and paste this code replacing the source with the new source.
 */

const variants = source;

module.exports = {
  up(db) {
    return db.collection('variants').insertMany(variants);
  },
  down(db, next) {
    const idsToRemove = variants.map(({ _id }) => _id);
    db
      .collection('variants')
      .deleteMany({ _id: { $in: idsToRemove } })
      .then(() => {
        db
          .collection('models')
          .updateMany({}, { $pull: { variants: { name: { $in: idsToRemove } } } });
      })
      .then(() => next())
      .catch(err => next(err));
  },
};
