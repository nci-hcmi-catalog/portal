import mongoose from 'mongoose';
import express from 'express';

import * as DictionaryHelper from '../helpers/dictionary';

import Dictionary from '../schemas/dictionary';
const dictionaryRouter = express.Router();

dictionaryRouter.get('/', async (req, res) => {
  const dictionary = await Dictionary.find().then(list => {
    return list;
  });
  res.json(dictionary);
});

// Use DELETE method on draft to reset it
dictionaryRouter.delete('/draft', async (req, res) => {
  try {
    const output = await DictionaryHelper.resetDraft();
    res.json(output);
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default dictionaryRouter;
