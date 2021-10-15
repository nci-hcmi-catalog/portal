module.exports = {
  up(db) {
    return db.collection('dictionary').findOneAndUpdate(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': [
            { value: 'WGS of parent tumor', dependents: [] },
            { value: 'WGS of normal', dependents: [] },
            { value: 'WGS of model', dependents: [] },
            { value: 'WXS of parent tumor', dependents: [] },
            { value: 'WXS of normal', dependents: [] },
            { value: 'WXS of model', dependents: [] },
            { value: 'DNA Methylation Array of parent tumor', dependents: [] },
            { value: 'DNA Methylation Array of normal', dependents: [] },
            { value: 'DNA Methylation Array of model', dependents: [] },
            { value: 'RNA-seq of parent tumor', dependents: [] },
            { value: 'RNA-seq of model', dependents: [] },
          ],
        },
      },
    );
  },

  down(db) {
    return db.collection('dictionary').findOneAndUpdate(
      { 'fields.name': 'molecularCharacterizations' },
      {
        $set: {
          'fields.$.values': [
            { value: 'WGS of parent tumor', dependents: [] },
            { value: 'WGS of normal', dependents: [] },
            { value: 'WGS of model', dependents: [] },
            { value: 'WXS of parent tumor', dependents: [] },
            { value: 'WXS of normal', dependents: [] },
            { value: 'WXS of model', dependents: [] },
            { value: 'Targeted-seq of parent tumor', dependents: [] },
            { value: 'Targeted-seq of normal', dependents: [] },
            { value: 'Targeted-seq of model', dependents: [] },
            { value: 'RNA-seq of parent tumor', dependents: [] },
            { value: 'RNA-seq of model', dependents: [] },
          ],
        },
      },
    );
  },
};
