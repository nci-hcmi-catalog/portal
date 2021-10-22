module.exports = {
  up(db) {
    return db.collection('models').updateMany(
      {
        molecular_characterizations: {
          $in: ['Targeted-seq of parent tumor', 'Targeted-seq of normal', 'Targeted-seq of model'],
        },
      },
      {
        $pull: {
          molecular_characterizations: {
            $in: [
              'Targeted-seq of parent tumor',
              'Targeted-seq of normal',
              'Targeted-seq of model',
            ],
          },
        },
      },
    );
  },

  down(db, next) {
    next();
  },
};
