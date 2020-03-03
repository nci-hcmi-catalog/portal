import mongoose from 'mongoose';

export const MatchedModelsSchema = new mongoose.Schema({
  models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }],
});

export default mongoose.model('MatchedModels', MatchedModelsSchema);
