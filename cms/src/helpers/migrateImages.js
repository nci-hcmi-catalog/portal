const aws = require('aws-sdk');
const mongoose = require('mongoose');
const stream = require('stream');
const uuid = require('uuid/v4');

require('dotenv').config();

const S3_BUCKET = process.env.S3_BUCKET;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3 = new aws.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const uploadToS3 = (fileName, fileStream) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: `${uuid()}-${fileName}`,
    Body: fileStream,
  };

  return new Promise(function(resolve, reject) {
    fileStream.once('error', reject);
    s3.upload(params)
      .promise()
      .then(resolve, reject);
  });
};

const conn = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  {
    useNewUrlParser: true,
  },
);

conn.once('open', () => {
  const images = conn.db.collection('images.files').find({});
  const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
  console.log('GridFSBucket is ready for downloads');

  images.forEach(image => {
    const ObjectId = mongoose.Types.ObjectId;
    const imageId = new ObjectId(image._id);
    const fileName = image.filename;
    const fileStream = new stream.Readable();

    bucket
      .openDownloadStream(imageId)
      .on('error', err =>
        console.log('An error occured trying to download from CMS for upload to S3: ', err),
      )
      .on('data', chunk => fileStream.push(chunk))
      .on('end', () => {
        fileStream.push(null);
        uploadToS3(fileName, fileStream)
          .then(data => {
            console.log('Successful image upload to s3: ', data);
            const model = conn.db
              .collection('models')
              .findOneAndUpdate(
                { 'files.file_id': String(image._id) },
                {
                  $set: {
                    'files.$.file_url': data.Location,
                  },
                },
              )
              .then(_ => console.log(`Successfully updated ${model.name} to use s3 image url`))
              .catch(err =>
                console.log('An error occured during model update to s3 URL', err.toString()),
              );
          })
          .catch(err => {
            console.error('An error occured during image upload to s3: ', err.toString());
          });
      });
  });
});
