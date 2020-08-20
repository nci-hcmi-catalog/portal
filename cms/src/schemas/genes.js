import mongoose from 'mongoose';

const GeneSchema = new mongoose.Schema(
  {
    _gene_id: { type: String, unique: true, required: true, es_indexed: true },
    symbol: { type: String, unique: true, required: true, es_indexed: true },
    name: { type: String, es_indexed: true },
    synonyms: { type: [String], es_indexewd: true },
    biotype: { type: String, es_indexed: false },
  },
  // {
  //   collection: 'genesReference',
  // },
);

export default mongoose.model('Gene', GeneSchema, 'geneReference');
