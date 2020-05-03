import mongoose from 'mongoose';
import { Dictionary, DictionaryValue, Dependent } from './dictionary';

export const draftStatus = { published: 'published', edited: 'edited', new: 'new' };

const DraftDependent = Dependent;
DraftDependent.values = {
  type: [
    new mongoose.Schema({
      status: {
        type: String,
        enum: Object.values(draftStatus),
        default: draftStatus.published,
      },
      value: String,
    }),
  ],
};

const DraftDependentSchema = new mongoose.Schema(DraftDependent);

const DraftValue = DictionaryValue;
DraftValue.status = {
  type: String,
  enum: Object.values(draftStatus),
  default: draftStatus.published,
};
DraftValue.original = { type: String };
DraftValue.dependents = { type: [DraftDependentSchema] };

const DraftValueSchema = new mongoose.Schema(DraftValue);

const Draft = Dictionary;
Draft.status = {
  type: String,
  enum: [draftStatus.published, draftStatus.edited],
  default: draftStatus.published,
};
Draft.values = { type: [DraftValueSchema] };

export const DraftSchema = new mongoose.Schema(Draft);

export default mongoose.model('DictionaryDraft', DraftSchema, 'dictionaryDraft');
