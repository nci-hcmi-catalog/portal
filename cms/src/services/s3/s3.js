// Use of require instead of import is used here because this file is used by the migrateImages script.
//  Scripts executed directly and not run through babel have issues with import statements.

import getLogger from '../../logger.js';

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} = require('@aws-sdk/client-s3');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const uuid = require('uuid');

const logger = getLogger('services/s3');

const Bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;

const credentials = defaultProvider();
const s3 = new S3Client({
  region,
  credentials,
});

const uploadToS3 = async (fileName, fileStream, modelName) => {
  const Key = `${uuid.v4()}-${fileName}`;

  const params = {
    Bucket,
    Body: fileStream,
    ContentLength: fileStream.readableLength,
    Key,
  };
  const command = new PutObjectCommand(params);
  logger.debug({ Key }, 'Attempting upload of file to S3');

  return new Promise(async (resolve, reject) => {
    fileStream.once('error', (error) => reject({ error, fileName, modelName }));
    try {
      const data = await s3.send(command);
      logger.info(
        { Key, Bucket, response: data },
        's3 upload',
        `Successfully uploaded object to S3`,
      );
      resolve({ data, fileName, modelName });
    } catch (error) {
      logger.error(`An error occured uploading image to S3. imageId: ${Key}`);
      logger.error(error);
      reject({ error, fileName, modelName });
    }
  });
};

const deleteFromS3 = async (id) => {
  const params = {
    Bucket,
    Key: id,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
    logger.info(params, 's3 delete', 'Successfully deleted image from S3');
    return {
      code: 200,
      msg: `image with id ${id} deleted`,
    };
  } catch (error) {
    logger.error(error, `An error occured deleting object from S3. imageId: ${id}`);
    return {
      code: 400,
      msg: `image with id ${id} not found`,
    };
  }
};

const testS3Connection = () => {
  const params = {
    Bucket,
  };
  return new Promise(async (resolve, reject) => {
    try {
      s3.send(new HeadBucketCommand(params)).then((data) => {
        resolve(data);
      });
    } catch {
      reject(err);
    }
  });
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  testS3Connection,
};
