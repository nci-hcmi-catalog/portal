import { Router } from 'express';
import mongoose from 'mongoose';
import sharp from 'sharp';

// Mongoose Setup
const conn = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  {
    useNewUrlParser: true,
  },
);
let bucket;
conn.once('open', function() {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
  console.log('Connected to Mongo Image Bucket');
});

const router = Router();

router.get('/images/:id', async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const imageId = new ObjectId(req.params.id);

    res.set('accept-ranges', 'bytes');

    const width = parseInt(req.query.w, 10) || undefined;
    const height = parseInt(req.query.h, 10) || undefined;
    const resizer = sharp().resize(width, height);

    bucket
      .openDownloadStream(imageId)
      .on('error', () => {
        console.log('error');
        res.status(400).json({ error: `file with ${req.params.id} not found` });
      })
      .pipe(resizer)
      .on('data', chunk => {
        res.write(chunk);
      })
      .on('end', () => {
        res.end();
      });
  } catch (err) {
    const errorJson = _.isEmpty(err) ? { error: 'Unknown Error occurred.' } : { error: err };
    return res.status(500).json(errorJson);
  }
});

export default router;
