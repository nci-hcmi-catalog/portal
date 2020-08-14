import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { uploadToS3, deleteFromS3 } from './../services/s3';

const imagesRouter = express.Router();

imagesRouter.post('/', async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage, limits: { fields: 1, files: 1, parts: 2 } });
  upload.single('image')(req, res, err => {
    if (err) {
      return res.status(500).json({ error: 'upload request failed' });
    }
    const fileName = req.body.filename;
    const fileStream = new Readable();
    fileStream.push(req.file.buffer);
    fileStream.push(null); // push null to mark data end

    uploadToS3(fileName, fileStream)
      .then(data => {
        console.log('Successful image upload to s3: ', data);
        return res.status(201).json({ id: data.Key, url: data.Location, fileName });
      })
      .catch(err => {
        console.error('An error occured during image upload to s3: ', err.toString());
        return res.status(500).json({ error: 'Error uploading file' });
      });
  });
});

export const deleteImage = async id => {
  try {
    deleteFromS3(id);
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
