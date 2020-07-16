import mongoose from 'mongoose';
import { modelStatus } from '../helpers/modelStatus';

// Used to remove values that are empty strings from document
const deleteEmptyStrings = v => {
  return v === null || v.length === 0 ? undefined : v;
};

const FilesSchema = new mongoose.Schema({
  file_id: { type: String, es_indexed: true },
  file_url: { type: String, es_indexed: true },
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

const GenomicVariant = new mongoose.Schema({
  gene: { type: String },
  aa_change: { type: String },
  transcript_id: { type: String },
  consequence_type: { type: String },
  class: { type: String },
  type: { type: String },
  chromosome: { type: String },
  start_position: { type: String },
  end_position: { type: String },
  specific_change: { type: String },
  classification: { type: String },
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
    age_at_diagnosis: { type: Number, ezs_indexed: true },
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
    somatic_maf_url: { type: String, es_indexed: true },
    expanded: { type: Boolean, es_indexed: true },
    files: { type: [FilesSchema], es_indexed: true },
    variants: { type: [VariantExpression], es_indexed: false },
    genomic_variants: { type: [GenomicVariant], es_indexed: false },
    matchedModels: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MatchedModels',
      es_indexed: false,
    },
    updateOldMatchesOnPublish: {
      type: [String],
      es_indexed: false,
    },
    status: {
      type: String,
      enum: [modelStatus.unpublished, modelStatus.published, modelStatus.unpublishedChanges],
      default: modelStatus.unpublished,
      es_indexed: false,
    },
    updatedBy: { type: String, es_indexed: false },
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
      genomic_variants: {
        es_type: 'nested',
        es_value: doc =>
          doc.genomic_variants.map(variant => ({
            gene: variant.gene,
            aa_change: variant.aa_change,
            transcript_id: variant.transcript_id,
            consequence_type: variant.consequence_type,
            class: variant.class,
            type: variant.type,
            chromosome: variant.chromosome,
            start_position: variant.start_position,
            end_position: variant.end_position,
            specific_change: variant.specific_change,
            classification: variant.classification,
            variant_id: `${variant.chromosome}:g.${variant.start_position}${
              variant.specific_change
            }`,
            name: `${variant.gene} ${variant.aa_change}`,
          })),
      },
      // genes: {
      //   es_type: 'string',
      //   es_value: doc => doc.genomic_variants.map(variant => variant.gene),
      // },
      // genomic_variant_names: {
      //   es_type: 'string',
      //   es_value: doc => doc.genomic_variants.map(variant => variant.name),
      // }
      // This is definitely a trick. You need to manually
      // add populatedMatches as an array of models that should be included as matched_models before calling esIndex()
      matched_models: {
        es_type: 'nested',
        es_value: doc =>
          (doc.populatedMatches || []).map(match => ({
            name: match.name,
            tissue_type: match.tissue_type,
          })),
      },
      has_matched_models: {
        es_type: 'boolean',
        es_value: doc => (doc.populatedMatches ? doc.populatedMatches.length >= 1 : false),
      },
      matched_models_list: {
        es_value: doc =>
          (doc.populatedMatches || [])
            .concat([doc])
            .map(i => i.name)
            .join(','),
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
