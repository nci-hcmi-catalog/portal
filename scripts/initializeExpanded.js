const mongoose = require('mongoose');

const { republishModels } = require('./utils/republishUtils');

// import this and override process.env BEFORE importing s3 services
const esUtils = require('./utils/esUtils');
process.env = esUtils.config;

const MONGO_COLLECTION = process.env.MONGO_COLLECTION;
const conn = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  {
    useNewUrlParser: true,
  },
);

conn.once('open', async () => {
  try {
    const models = await conn.db
      .collection(process.env.MONGO_COLLECTION)
      .find({ expanded: { $exists: false } });
    console.log('Models to update:');
    let model;
    while ((model = await models.next()) != null) {
      console.log(model.name);
    }
    console.log('\nUpdating now...');
    const updateResult = await conn.db
      .collection(process.env.MONGO_COLLECTION)
      .updateMany({ expanded: { $exists: false } }, { $set: { expanded: true } });

    console.log('Models updated:', updateResult.modifiedCount);
  } catch (e) {
    console.log('Error caused script to terminate');
    console.log(e);
  } finally {
    conn.close();
  }
});
