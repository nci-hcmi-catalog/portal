import mongoose from 'mongoose';

const DictionaryValueSchema = new mongoose.Schema({
  value: { type: String },
  dependents: { type: Object },
});

export const DictionarySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  displayName: { type: String, unique: true, required: true },
  dependentValues: { type: [String], required: true },
  values: { type: [DictionaryValueSchema] },
});

export default mongoose.model('Dictionary', DictionarySchema, 'dictionary');
