import 'babel-polyfill';
import express from 'express';
import socketIO from 'socket.io';
import { Server } from 'http';
import { rainbow } from 'chalk-animation';
import Arranger from '@arranger/server';
import cors from 'cors';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

// create Cell model
const Cell = mongoose.model('Cell', { name: String });

const port = process.env.PORT || 5050;
const app = express();
const http = Server(app);
const io = socketIO(http);
app.use(cors());

Arranger({ io }).then(router => {
  app.use(router);

  // save new cell placeholder endpoint
  app.post('/saveCell', async (req, res) => {
    const cell = new Cell({ name: req.body.cellName || 'Zildjian' });
    await cell.save();
    console.log('meow');
    res.json({ message: 'cell saved succesfully' });
  });

  http.listen(port, async () => {
    rainbow(`⚡️ Listening on port ${port} ⚡️`);
  });
});
