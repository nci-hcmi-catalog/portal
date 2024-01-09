module.exports = {
  async up(db) {
    await db.collection('models').updateMany(
      {
        molecular_characterizations: { $regex: /Methylation Array of/ },
      },
      [
        {
          $set: {
            molecular_characterizations: {
              $map: {
                input: '$molecular_characterizations',
                as: 'elem',
                in: {
                  $replaceOne: {
                    input: '$$elem',
                    find: 'Methylation Array of',
                    replacement: 'Methylation of',
                  },
                },
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
        molecular_characterizations: { $regex: /Methylation of/ },
      },
      [
        {
          $set: {
            molecular_characterizations: {
              $map: {
                input: '$molecular_characterizations',
                as: 'elem',
                in: {
                  $replaceOne: {
                    input: '$$elem',
                    find: 'Methylation of',
                    replacement: 'Methylation Array of',
                  },
                },
              },
            },
          },
        },
      ],
    );
  },
};
