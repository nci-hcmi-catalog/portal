import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { uploadToS3, deleteFromS3 } from './../services/s3';

import getLogger from '../logger';
const logger = getLogger('routes/images');

const imagesRouter = express.Router();

imagesRouter.post('/', async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, files: 1, parts: 2 } });
  upload.single('image')(req, res, error => {
    if (error) {
      return res.status(500).json({ error: 'upload request failed' });
    }
    const fileName = req.body.filename;
    const fileStream = new Readable();
    fileStream.push(req.file.buffer);
    fileStream.push(null); // push null to mark data end

    uploadToS3(fileName, fileStream)
      .then(({ data }) => {
        return res.status(201).json({ id: data.Key, url: data.Location, fileName });
      })
      .catch(({ error }) => {
        logger.error(error, 'An error occured during image upload to s3');
        return res.status(500).json({ error: 'Error uploading file' });
      });
  });
});

export const deleteImage = async id => {
  try {
    deleteFromS3(id);
  } catch (error) {
    logger.error(
      { error, imageId: id },
      `An unexpected error occurred while attempting to delete image from S3`,
    );
    return {
      code: 500,
      msg: `error removing image with id ${id}`,
    };
  }
};

export default imagesRouter;
