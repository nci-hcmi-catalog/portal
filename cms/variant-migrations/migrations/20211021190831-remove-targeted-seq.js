const dnaMethylationArrayValues = ['DNA Methylation Array of parent tumor', 'DNA Methylation Array of normal', 'DNA Methylation Array of model'];
const targetedSeqValues = ['Targeted-seq of parent tumor', 'Targeted-seq of normal', 'Targeted-seq of model'];

module.exports = {
  up(db) {
    return db.collection('models').updateMany(
      {
        molecular_characterizations: {
          $in: targetedSeqValues,
        },
      },
      {
        $pull: {
          molecular_characterizations: {
            $in: targetedSeqValues,
          },
        },
      },
    );
  },

  down(db) {
    return db.collection('models').updateMany(
      {
        molecular_characterizations: {
          $in: dnaMethylationArrayValues,
        },
      },
      {
        $pull: {
          molecular_characterizations: {
            $in: dnaMethylationArrayValues,
          },
        },
      },
    );
  },
};
