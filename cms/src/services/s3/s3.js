import getLogger from '../../logger';
const logger = getLogger('services/s3');

const aws = require('aws-sdk');
const uuid = require('uuid/v4');

const S3_BUCKET = process.env.S3_BUCKET;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3 = new aws.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const uploadToS3 = (fileName, fileStream) => {
  const Key = `${uuid()}-${fileName}`;
  const params = {
    Bucket: S3_BUCKET,
    Key,
    Body: fileStream,
  };
  logger.debug({ Key }, 'Attempting upload of file to S3');

  return new Promise((resolve, reject) => {
    fileStream.once('error', reject);
    s3.upload(params)
      .promise()
      .then(resolve, reject)
      .catch(reject);
  });
};

const deleteFromS3 = id => {
  const params = {
    Bucket: S3_BUCKET,
    Key: id,
  };

  s3.deleteObject(params, (err, data) => {
    if (error) {
      logger.error({ error, imageId: id }, `An error occured deleting image from S3`);
      return {
        code: 400,
        msg: `image with id ${id} not found`,
      };
    } else {
      logger.info({ imageId: id }, `Successfully deleted image from S3`);
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
