import aws from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import uuid from 'uuid/v4';

const imagesRouter = express.Router();
const S3_BUCKET = process.env.S3_BUCKET;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3 = new aws.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const uploadToS3 = (fileStream, fileName) => {
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

imagesRouter.post('/', async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, files: 1, parts: 2 } });
  upload.single('image')(req, res, err => {
    if (err) {
      return res.status(500).json({ error: 'upload request failed' });
    }
    const filename = req.body.filename;
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null); // push null to mark data end

    uploadToS3(readableStream, filename)
      .then(data => {
        console.log('Successful image upload to s3: ', data);
        return res.status(201).json({ id: data.Key, url: data.Location, filename });
      })
      .catch(err => {
        console.error('An error occured during image upload to s3: ', err.toString());
        return res.status(500).json({ error: 'Error uploading file' });
      });
  });
});

export const deleteImage = async id => {
  try {
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
  } catch (err) {
    console.error(
      `An unexpected error occurred while attempting to delete ${id}: `,
      err.toString(),
    );
    return {
      code: 500,
      msg: `error removing image with id ${id}`,
    };
  }
};

export default imagesRouter;
