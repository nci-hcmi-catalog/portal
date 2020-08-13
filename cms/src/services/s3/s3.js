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

module.exports = {
  uploadToS3,
  deleteFromS3,
};
