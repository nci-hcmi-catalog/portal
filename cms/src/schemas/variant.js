import mongoose from 'mongoose';

export const VariantSchema = new mongoose.Schema({
  _id: { type: String },
  type: { type: String },
  category: { type: String },
  genes: { type: [String] },
});

export default mongoose.model('Variant', VariantSchema);
