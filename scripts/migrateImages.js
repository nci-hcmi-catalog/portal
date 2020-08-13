/* eslint-disable no-loop-func */
const mongoose = require('mongoose');
const stream = require('stream');

// import this and override process.env BEFORE importing s3 services
const esUitils = require('./esUtils');
process.env = esUitils.config;

const { uploadToS3 } = require('./../cms/src/services/s3/s3');

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

          bucket
            .openDownloadStream(imageId)
            .on('error', err => {
              console.error(
                'An error occured trying to download image from mongo for upload to S3: ',
                err,
              );
              reject(err);
            })
            .on('data', async chunk => await fileStream.push(chunk))
            .on('end', async () => {
              await fileStream.push(null);
              await uploadToS3(fileName, fileStream)
                .then(async data => {
                  console.log('Successful image upload to S3: ', data);
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
                    .then(_ => {
                      console.log('Successfully updated model to use S3 image URL!');
                      resolve();
                    })
                    .catch(err => {
                      console.error(
                        'An error occured while updating the model to use S3 image URL: ',
                        err.toString(),
                      );
                      reject(err);
                    });
                })
                .catch(err => {
                  console.error('An error occured during image upload to S3: ', err.toString());
                  reject(err);
                });
            });
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
