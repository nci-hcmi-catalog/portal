import 'babel-polyfill';
import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import Model from './schemas/model';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import restify from 'express-restify-mongoose';
import morgan from 'morgan';
import { data_sync_router } from './routes/sync-data';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');

const port = process.env.PORT || 8080;
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('combined'));

restify.serve(router, Model);
app.use('/', data_sync_router);
app.use(router);
app.use(cors());
const http = Server(app);

http.listen(port, async () => {
  console.log(`⚡️ Listening on port ${port} ⚡️`);
});
