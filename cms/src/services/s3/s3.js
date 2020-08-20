// Use of require instead of import is used here because this file is used by the migrateImages script.
//  Scripts executed directly and not run through babel have issues with import statements.

const getLogger = require('../../logger');
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

const uploadToS3 = async (fileName, fileStream, modelName) => {
  const Key = `${uuid()}-${fileName}`;
  const params = {
    Bucket: S3_BUCKET,
    Key,
    Body: fileStream,
  };
  logger.debug({ Key }, 'Attempting upload of file to S3');

  return new Promise((resolve, reject) => {
    fileStream.once('error', err => reject({ err, fileName, modelName }));
    s3.upload(params, (err, data) => {
      if (err) {
        reject({ err, fileName, modelName });
      } else {
        logger.audit(
          { Key, Bucket: S3_BUCKET, data },
          's3 upload',
          `Successfully uploaded object to S3`,
        );
        resolve({ ...data, fileName, modelName });
      }
    });
  });
};

const deleteFromS3 = async id => {
  const params = {
    Bucket: S3_BUCKET,
    Key: id,
  };

  s3.deleteObject(params, (error, data) => {
    if (error) {
      logger.error({ error, imageId: id }, `An error occured deleting object from S3`);
      return {
        code: 400,
        msg: `image with id ${id} not found`,
      };
    } else {
      logger.audit(params, 's3 delete', 'Successfully deleted image from S3');
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
