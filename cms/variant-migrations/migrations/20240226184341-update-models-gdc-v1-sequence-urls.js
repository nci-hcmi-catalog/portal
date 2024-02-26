module.exports = {
  async up(db) {
    await db.collection('models').updateMany(
      {
        source_sequence_url: { $regex: /https:\/\/portal.gdc.cancer.gov\/repository/ },
      },
      [
        {
          $set: {
            source_sequence_url: {
              $replaceAll: {
                input: '$source_sequence_url',
                find: 'https://portal.gdc.cancer.gov/repository',
                replacement: 'https://portal.gdc.cancer.gov/v1/repository',
              },
            },
          },
        },
      ],
    );
  },
  async down(db) {
    await db.collection('models').updateMany(
      {
        source_sequence_url: { $regex: /https:\/\/portal.gdc.cancer.gov\/v1\/repository/ },
      },
      [
        {
          $set: {
            source_sequence_url: {
              $replaceAll: {
                input: '$source_sequence_url',
                find: 'https://portal.gdc.cancer.gov/v1/repository',
                replacement: 'https://portal.gdc.cancer.gov/repository',
              },
            },
          },
        },
      ],
    );
  },
};
