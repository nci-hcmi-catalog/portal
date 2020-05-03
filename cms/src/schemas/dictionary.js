import mongoose from 'mongoose';

export const DictionaryValue = {
  value: { type: String },
  dependents: { type: [DictionarySchema] },
};

const DictionaryValueSchema = new mongoose.Schema(DictionaryValue);

export const Dictionary = {
  name: { type: String, unique: true, required: true },
  displayName: { type: String, unique: true, required: true },
  dependentValues: { type: [String] },
  values: { type: [DictionaryValueSchema] },
};

export const DictionarySchema = new mongoose.Schema(Dictionary);

export default mongoose.model('Dictionary', DictionarySchema, 'dictionary');
