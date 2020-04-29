import mongoose from 'mongoose';
import express from 'express';

import DictionaryModel from '../schemas/dictionary';
const dictionaryRouter = express.Router();

dictionaryRouter.get('/', async (req, res) => {
  const dictionary = await DictionaryModel.find().then(list => {
    console.log(list);
    return list;
  });
  res.json(dictionary);
});

export default dictionaryRouter;
