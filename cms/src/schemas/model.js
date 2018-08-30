import mongoose from 'mongoose';
import { modelStatus } from './constants';

const FilesSchema = new mongoose.Schema({
  name: { type: String, es_indexed: true },
  type: { type: String, es_indexed: true },
  scale_bar_length: { type: String, es_indexed: true },
  magnification: { type: Number, es_indexed: true },
  passage_number: { type: Number, es_indexed: true },
  marked_for_deletion: { type: Boolean, es_index: true, default: false },
});

export const ModelSchema = new mongoose.Schema(
  {
    name: { type: String, es_indexed: true },
    type: { type: String, es_indexed: true },
    growth_rate: { type: Number, es_indexed: true },
    split_ratio: { type: String, es_indexed: true },
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
    clinical_tumor_diagnosis: { type: String, es_indexed: false },
    histological_type: { type: String, es_indexed: false },
    clinical_stage_grouping: { type: String, es_indexed: false },
    site_of_sample_acquisition: { type: String, es_indexed: false },
    tumor_histological_grade: { type: String, es_indexed: false },
    licensing_required: { type: Boolean, es_indexed: true },
    source_model_url: { type: String, es_indexed: true },
    source_sequence_url: { type: String, es_indexed: true },
    files: { type: [FilesSchema], es_indexed: true },
    status: {
      type: String,
      enum: [
        modelStatus.unpublished,
        modelStatus.published,
        modelStatus.unpublishedChanges,
        modelStatus.other,
      ],
      default: modelStatus.unpublished,
      es_indexed: true,
    },
    updatedBy: { type: String, es_indexed: true },
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
    },
    timestamps: true,
    collection: process.env.MONGO_COLLECTION,
  },
);

export default mongoose.model('Model', ModelSchema);
