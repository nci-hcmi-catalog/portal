import mongoose from 'mongoose';

export const VariantSchema = new mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  category: { type: String },
  genes: { type: [String] },
  models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
});

export default mongoose.model('Variant', VariantSchema);
