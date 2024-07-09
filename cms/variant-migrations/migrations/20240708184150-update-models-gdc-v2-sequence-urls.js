const OLD_URL_PATTERN = /https:\/\/portal\.gdc\.cancer\.gov\/v1\/repository\?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases\.case_id%22%2C%22value%22%3A%5B%22(.*?)%22%5D%7D%7D%5D%7D&searchTableTab=files/;
const NEW_URL_PATTERN = /https:\/\/portal\.gdc\.cancer\.gov\/cases\/(.*?)#files/;

module.exports = {
  async up(db) {
    const collection = db.collection('models');

    const cursor = collection.find({
      source_sequence_url: {
        $regex: OLD_URL_PATTERN,
      },
    });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const match = doc.source_sequence_url.match(OLD_URL_PATTERN);

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
        $regex: NEW_URL_PATTERN,
      },
    });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const match = doc.source_sequence_url.match(NEW_URL_PATTERN);

      if (match) {
        const caseId = match[1];
        const newUrl = `https://portal.gdc.cancer.gov/v1/repository?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%22${caseId}%22%5D%7D%7D%5D%7D&searchTableTab=files`;

        await collection.updateOne({ _id: doc._id }, { $set: { source_sequence_url: newUrl } });
      }
    }
  },
};
