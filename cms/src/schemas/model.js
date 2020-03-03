import mongoose from 'mongoose';
import { modelStatus } from '../helpers/modelStatus';

// Used to remove values that are empty strings from document
const deleteEmptyStrings = v => {
  return v === null || v.length === 0 ? undefined : v;
};

const FilesSchema = new mongoose.Schema({
  file_id: { type: String, es_indexed: true },
  file_name: { type: String, es_indexed: true },
  file_type: { type: String, es_indexed: true },
  scale_bar_length: { type: String, es_indexed: true },
  magnification: { type: Number, es_indexed: true },
  passage_number: { type: Number, es_indexed: true },
  marked_for_deletion: { type: Boolean, es_index: true, default: false },
});

const VariantExpression = new mongoose.Schema({
  variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  assessment_type: { type: String },
  expression_level: { type: String },
});

export const ModelSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, es_indexed: true },
    type: { type: String, es_indexed: true },
    growth_rate: { type: Number, set: deleteEmptyStrings, es_indexed: true },
    split_ratio: { type: String, es_indexed: true },
    time_to_split: { type: String, es_indexed: true },
    gender: { type: String, es_indexed: true },
    race: { type: String, es_indexed: true },
    age_at_diagnosis: { type: Number, es_indexed: true },
    age_at_sample_acquisition: { type: Number, es_indexed: true },
    date_of_availability: { type: Date, es_indexed: true },
    primary_site: { type: String, es_indexed: true },
    tnm_stage: { type: String, es_indexed: true },
    neoadjuvant_therapy: { type: String, es_indexed: true },
    chemotherapeutic_drugs: { type: Boolean, es_indexed: true },
    disease_status: { type: String, es_indexed: true },
    vital_status: { type: String, es_indexed: true },
    therapy: { type: [String], es_indexed: true },
    molecular_characterizations: { type: [String], es_indexed: true },
    tissue_type: { type: String, es_indexed: true },
    clinical_tumor_diagnosis: { type: String, es_indexed: false },
    histological_type: { type: String, set: deleteEmptyStrings, es_indexed: false },
    clinical_stage_grouping: { type: String, set: deleteEmptyStrings, es_indexed: false },
    site_of_sample_acquisition: { type: String, set: deleteEmptyStrings, es_indexed: false },
    tumor_histological_grade: { type: String, set: deleteEmptyStrings, es_indexed: false },
    licensing_required: { type: Boolean, es_indexed: true },
    distributor_part_number: { type: String, es_indexed: true },
    source_model_url: { type: String, es_indexed: true },
    source_sequence_url: { type: String, es_indexed: true },
    files: { type: [FilesSchema], es_indexed: true },
    variants: { type: [VariantExpression], es_indexed: false },
    status: {
      type: String,
      enum: [
        modelStatus.unpublished,
        modelStatus.published,
        modelStatus.unpublishedChanges,
        modelStatus.other,
      ],
      default: modelStatus.unpublished,
      es_indexed: false,
    },
    updatedBy: { type: String, es_indexed: false },
    matchedModels: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MatchedModels',
      es_indexed: false,
    },
  },
  {
    es_extend: {
      clinical_diagnosis: {
        es_type: 'object',
        es_value: doc => ({
          clinical_tumor_diagnosis: doc.clinical_tumor_diagnosis,
          histological_type: doc.histological_type,
          clinical_stage_grouping: doc.clinical_stage_grouping,
          site_of_sample_acquisition: doc.site_of_sample_acquisition,
          tumor_histological_grade: doc.tumor_histological_grade,
        }),
      },
      variants: {
        es_type: 'nested',
        es_value: doc =>
          doc.variants.map(variant => ({
            assessment_type: variant.assessment_type,
            expression_level: variant.expression_level,
            category: variant.variant.category,
            genes: variant.variant.genes,
            name: variant.variant.name,
            type: variant.variant.type,
          })),
      },
      createdAt: {
        es_type: 'date',
        es_value: doc => doc.createdAt,
      },
      updatedAt: {
        es_type: 'date',
        es_value: doc => doc.updatedAt,
      },
    },
    timestamps: true,
    collection: process.env.MONGO_COLLECTION,
  },
);

export default mongoose.model('Model', ModelSchema);
