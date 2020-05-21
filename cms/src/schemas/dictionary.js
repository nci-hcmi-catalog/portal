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

export const DictionaryField = {
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  dependentValues: { type: [String] },
  values: { type: [DictionaryValueSchema] },
};

export const DictionaryFieldSchema = new mongoose.Schema(DictionaryField);

export const Dictionary = {
  fields: { type: [DictionaryFieldSchema] },
};
export const DictionarySchema = new mongoose.Schema(Dictionary, {
  timestamps: { createdAt: 'created_at' },
});

export default mongoose.model('Dictionary', DictionarySchema, 'dictionary');
