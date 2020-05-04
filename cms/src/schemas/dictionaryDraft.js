import mongoose from 'mongoose';
import { DictionaryField, DictionaryValue, Dependent } from './dictionary';

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
      value: { type: String },
      original: { type: String },
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

const DraftStats = {
  edited: { type: Number, default: 0 },
  new: { type: Number, default: 0 },
};
const DraftStatsSchema = new mongoose.Schema(DraftStats);

const Draft = DictionaryField;
Draft.status = {
  type: String,
  enum: [draftStatus.published, draftStatus.edited],
  default: draftStatus.published,
};
Draft.stats = { type: DraftStatsSchema };
Draft.values = { type: [DraftValueSchema] };

export const DraftSchema = new mongoose.Schema(Draft);

export default mongoose.model('DictionaryDraft', DraftSchema, 'dictionaryDraft');
