const aws = require('aws-sdk');
const uuid = require('uuid/v4');

const S3_BUCKET = process.env.S3_BUCKET;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3 = new aws.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const uploadToS3 = (fileName, fileStream, modelName) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: `${uuid()}-${fileName}`,
    Body: fileStream,
  };

  return new Promise((resolve, reject) => {
    fileStream.once('error', err => reject({ err, fileName, modelName }));
    s3.upload(params, (err, data) => {
      if (err) {
        reject({ err, fileName, modelName });
      } else {
        resolve({ data, fileName, modelName });
      }
    });
  });
};

const deleteFromS3 = id => {
  const params = {
    Bucket: S3_BUCKET,
    Key: id,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(`An error occured deleting image ${id} from S3: `, err.toString());
      return {
        code: 400,
        msg: `image with id ${id} not found`,
      };
    } else {
      console.log(`Successfully deleted image ${id} from S3.`);
      return {
        code: 200,
        msg: `image with id ${id} deleted`,
      };
    }
  });
};

const testS3Connection = () => {
  const params = {
    Bucket: S3_BUCKET,
  };

  return new Promise((resolve, reject) => {
    s3.headBucket(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  testS3Connection,
};
