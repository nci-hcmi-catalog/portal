import mongoose from 'mongoose';
import { Dictionary, DictionaryValue } from './dictionary';

export const draftStatus = { published: 'published', edited: 'edited', new: 'new' };

const DraftValue = DictionaryValue;
DictionaryDraftValue.status = {
  type: String,
  enum: Object.values(draftStatus),
  default: draftStatus.new,
};
DictionaryDraftValue.original = { type: String };

const DraftValueSchema = new mongoose.Schema(DraftValue);

const Draft = Dictionary;
Draft.status = {
  type: String,
  enum: [draftStatus.published, draftStatus.edited],
  default: draftStatus.published,
};

export const DraftSchema = new mongoose.Schema(Draft);

export default mongoose.model('DictionaryDraft', DraftSchema, 'dictionaryDraft');
