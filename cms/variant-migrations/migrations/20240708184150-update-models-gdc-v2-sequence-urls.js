module.exports = {
  async up(db) {
    const collection = db.collection('models');

    const cursor = collection.find({
      source_sequence_url: {
        $regex: /https:\/\/portal\.gdc\.cancer\.gov\/v1\/repository\?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases\.case_id%22%2C%22value%22%3A%5B%22(.*?)%22%5D%7D%7D%5D%7D&searchTableTab=files/,
      },
    });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const pattern = /https:\/\/portal\.gdc\.cancer\.gov\/v1\/repository\?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases\.case_id%22%2C%22value%22%3A%5B%22(.*?)%22%5D%7D%7D%5D%7D&searchTableTab=files/;
      const match = doc.source_sequence_url.match(pattern);

      if (match) {
        const caseId = match[1];
        const newUrl = `https://portal.gdc.cancer.gov/cases/${caseId}#files`;

        await collection.updateOne({ _id: doc._id }, { $set: { source_sequence_url: newUrl } });
      }
    }
  },
  async down(db) {
    const collection = db.collection('models');

    const cursor = collection.find({
      source_sequence_url: {
        $regex: /https:\/\/portal\.gdc\.cancer\.gov\/cases\/(.*?)#files/,
      },
    });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const pattern = /https:\/\/portal\.gdc\.cancer\.gov\/v1\/repository\?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases\.case_id%22%2C%22value%22%3A%5B%22(.*?)%22%5D%7D%7D%5D%7D&searchTableTab=files/;
      const match = doc.source_sequence_url.match(pattern);

      if (match) {
        const caseId = match[1];
        const newUrl = `https://portal.gdc.cancer.gov/v1/repository?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%22${caseId}%22%5D%7D%7D%5D%7D&searchTableTab=files`;

        await collection.updateOne({ _id: doc._id }, { $set: { source_sequence_url: newUrl } });
      }
    }
  },
};
