/* eslint-disable no-loop-func */
const mongoose = require('mongoose');
const stream = require('stream');

// import this and override process.env BEFORE importing s3 services
const esUitils = require('./esUtils');
process.env = esUitils.config;

const { uploadToS3 } = require('./../cms/src/services/s3/s3');

const migrateImage = async ({
  bucket,
  imageId,
  imageIdStr,
  fileName,
  fileStream,
  modelName,
  resolve,
  reject,
}) => {
  bucket
    .openDownloadStream(imageId)
    .on('error', err => {
      console.error(
        `An error occured trying to download image ${fileName} from mongo model ${modelName} for upload to S3: `,
        err.toString(),
      );
      reject(err);
    })
    .on('data', async chunk => await fileStream.push(chunk))
    .on('end', async () => {
      await fileStream.push(null);
      await uploadToS3(fileName, fileStream, modelName)
        .then(async (data, fileName, modelName) => {
          console.log(
            `Successful image upload of image ${fileName} from model ${modelName} to S3: `,
            data,
          );
          await conn.db
            .collection('models')
            .findOneAndUpdate(
              { 'files.file_id': imageIdStr },
              {
                $set: {
                  'files.$.file_id': data.Key,
                  'files.$.file_url': data.Location,
                },
              },
            )
            .then(model => {
              console.log(
                `Successfully updated model${
                  model && model.name ? ` ${model.name} ` : ' '
                }to use S3 image URL!`,
              );
              resolve();
            })
            .catch((err, fileName, modelName) => {
              console.error(
                `An error occured while updating the model ${modelName} to use S3 image URL for image ${fileName}: `,
                err.toString(),
              );
              reject(err);
            });
        })
        .catch((err, fileName, modelName) => {
          console.error(
            `An error occured during upload to S3 for image ${fileName} of model ${modelName}: `,
            err.toString(),
          );
          reject(err);
        });
    });
}

const conn = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  {
    useNewUrlParser: true,
  },
);

conn.once('open', async () => {
  try {
    const images = await conn.db.collection('images.files').find({});
    const bucket = await new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
    console.log('Connection to db is ready, initiating image migration to S3...');

    const migrations = [];
    let image;
    while ((image = await images.next()) != null) {
      migrations.push(
        new Promise(async (resolve, reject) => {
          const ObjectId = mongoose.Types.ObjectId;
          const imageId = new ObjectId(image._id);
          const imageIdStr = String(image._id);
          const fileName = image.filename;
          const fileStream = new stream.Readable();
          await new Promise((res, rej) => {
            conn.db.collection('models').findOne({ 'files.file_id': imageIdStr }, (err, obj) => {
              if (err) {
                console.log('An error occurred during model lookup: ', err.toString());
                rej(err);
              }
              res(obj);
            });
          })
            .then(async obj => {
              if (!obj || !obj.name) {
                console.log(
                  `No model found with image of id ${imageIdStr}, likely already migrated. Skipping...`,
                );
                resolve();
              }

              const modelName = obj.name;

              await migrateImage({
                bucket,
                imageId,
                imageIdStr,
                fileName,
                fileStream,
                modelName,
                resolve,
                reject,
              });
            })
            .catch(err => reject(err));
        }),
      );
    }

    Promise.all(migrations)
      .then(() => {
        console.log('Image migration completed successfully, closing connection to db.');
        conn.close();
      })
      .catch(err => {
        console.error('An error occurred during image migration: ', err.toString());
      });
  } catch (err) {
    console.error('An unexpected error occurred: ', err.toString());
  }
});
