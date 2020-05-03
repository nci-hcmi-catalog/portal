import mongoose from 'mongoose';

export const Dependent = {
  name: { type: String },
  displayName: { type: String },
  dependentValues: { type: [String] },
  values: {
    type: [
      new mongoose.Schema({
        value: { type: String },
      }),
    ],
  },
};
const DictionaryDependentSchema = new mongoose.Schema(Dependent);

export const DictionaryValue = {
  value: { type: String },
  dependents: { type: [DictionaryDependentSchema] },
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
