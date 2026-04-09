import _ from 'lodash';
import mongoose from 'mongoose';

import Model from '../../schemas/model.js';
import getPublishValidation from '../../validation/model.js';
import { modelStatus } from '../../helpers/modelStatus.js';
import MatchUtils from '../../helpers/matchedModels.js';
import getLogger from '../../logger.js';

import indexLastUpdated from './indexLastUpdated.js';
import indexModel from './indexModel.js';
import { updateGeneSearchIndicies } from './genomicVariants.js';

const logger = getLogger('services/search-client/publish');

/**
 * Removes Mongoose specific keys & values to prepare data for Search indexing
 */
const cleanMongoDoc = (doc) => {
  const mongoKeys = ['_id', '__v'];
  // Remove keys from base Document object
  let cleanedDoc = _.omit(doc, mongoKeys);
  for (const key in cleanedDoc) {
    // Review is nested values also need Mongoose keys removed
    const value = cleanedDoc[key];
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        const firstEntry = value[0];
        // Remove nested keys when property is an array of objects
        const cleanedVals =
          firstEntry && typeof firstEntry === 'object'
            ? value.map((val) => {
                const cleanedValue = _.omit(val, mongoKeys);
                return cleanedValue;
              })
            : value;
        cleanedDoc[key] = cleanedVals;
      } else if (value instanceof mongoose.Types.ObjectId) {
        // Parse Mongoose ObjectId Objects to a plain string
        cleanedDoc[key] = value.toString();
      } else if (!(value instanceof Date)) {
        // Remove keys when value is an object, ignoring Dates
        const cleanedValue = _.omit(value, mongoKeys);
        cleanedDoc[key] = cleanedValue;
      }
    }
  }
  return cleanedDoc;
};

/**
 * Collects gene names and counts
 */
const getGeneMetadata = async (doc) => {
  // Assemble list of genes from genomic_variants.gene and variants.variant.genes
  const genomic_variant_genes = doc.genomic_variants.map((gv) => gv.gene);
  const variant_genes = _.flatten(doc.variants.map((wrapper) => wrapper.variant.genes));
  const genes = _.uniq([...genomic_variant_genes, ...variant_genes]);
  // "Mutated Genes" are Research Somatic Variants (`genomic_variants` in the codebase) and Clinical Variants only
  const clinical_variant_genes = _.flatten(
    doc.variants
      .filter((variant) => variant.variant && variant.variant.type === 'Clinical')
      .map((wrapper) => wrapper.variant.genes),
  );
  const mutated_genes = _.uniq([...genomic_variant_genes, ...clinical_variant_genes]);

  // Get counts of the 4 categories shown on search table
  const genes_count = genes.length;
  const mutated_genes_count = mutated_genes.length;
  const genomic_variant_count = doc.genomic_variants.length;
  const clinical_variant_count = doc.variants.filter(
    (variant) => variant.variant && variant.variant.type === 'Clinical',
  ).length;
  const histopathological_variant_count = doc.variants.filter(
    (variant) => variant.variant && variant.variant.type === 'Histopathological Biomarker',
  ).length;

  const filename = doc.gene_metadata?.filename;
  const import_data = doc.gene_metadata?.import_date;
  const file_id = doc.gene_metadata?.file_id;

  const output = {
    clinical_variant_count,
    file_id,
    filename,
    genes,
    genes_count,
    genomic_variant_count,
    histopathological_variant_count,
    import_data,
    mutated_genes,
    mutated_genes_count,
  };

  return output;
};

/**
 * Returns an array containing names and tissue types of related Matched Models
 */
const getMatchedModels = async (modelRecord) => {
  if (modelRecord.matchedModels) {
    const matchedModels = await Model.find({
      _id: { $in: modelRecord.matchedModels.models || [] },
    });
    const matches = matchedModels
      .filter(
        (model) => model.status !== modelStatus.unpublished && model.name !== modelRecord.name,
      )
      .map((record) => {
        const { name, tissue_type } = record;
        return { name, tissue_type };
      });

    return matches;
  }
  return undefined;
};

/**
 * Aggregates Model metadata and formats Model document for Search client indexing
 * Ports logic previously found in schemas/model es_extends
 */
const formatModelToDocument = async (doc) => {
  const modelRecord = doc.toObject();

  const clinical_diagnosis = {
    clinical_tumor_diagnosis: modelRecord.clinical_tumor_diagnosis,
    histological_type: modelRecord.histological_type,
    clinical_stage_grouping: modelRecord.clinical_stage_grouping,
    site_of_sample_acquisition: modelRecord.site_of_sample_acquisition,
    tumor_histological_grade: modelRecord.tumor_histological_grade,
  };

  const variants = modelRecord.variants.map((variant) => ({
    assessment_type: variant.assessment_type,
    expression_level: variant.expression_level,
    category: variant.variant.category,
    genes: variant.variant.genes,
    name: variant.variant.name,
    type: variant.variant.type,
  }));

  const genomic_variants = modelRecord.genomic_variants.map((variant) => ({
    gene: variant.gene,
    aa_change: variant.aa_change,
    type: variant.type,
    transcript_id: variant.transcript_id,
    consequence_type: variant.consequence_type,
    class: variant.class,
    gene_biotype: variant.gene_biotype,
    chromosome: variant.chromosome,
    start_position: variant.start_position,
    end_position: variant.end_position,
    specific_change: variant.specific_change,
    classification: variant.classification,
    ensemble_id: variant.ensemble_id,
    synonyms: variant.synonyms,
    entrez_id: variant.entrez_id,
    variant_id: variant.variant_id,
    name: `${variant.gene} ${variant.aa_change}`,
  }));

  const gene_metadata = await getGeneMetadata(modelRecord);

  const matched_models = await getMatchedModels(modelRecord);

  const has_matched_models = !!matched_models;
  const matched_models_list =
    matched_models
      ?.concat([modelRecord])
      .map((i) => i.name)
      .join(',') || [];

  const mappedRecord = {
    ...modelRecord,
    clinical_diagnosis,
    variants,
    genomic_variants,
    gene_metadata,
    matched_models,
    has_matched_models,
    matched_models_list,
  };

  const cleanedDoc = cleanMongoDoc(mappedRecord);
  return cleanedDoc;
};

export const publishModel = async (filter, individualPublish = true) => {
  await indexOneToES(filter);
  await indexMatchedModelsToES(filter);

  // For individual publishes, update gene search indices immediately (if required)
  if (individualPublish) {
    const modelWithVariantChanges = await Model.findOne({ ...filter, variants_modified: true });
    if (modelWithVariantChanges) {
      await updateGeneSearchIndicies();
      modelWithVariantChanges.variants_modified = false;
      await modelWithVariantChanges.save();
    }
  }
};

// For bulk publishes, update gene search indices after all models are published
export const bulkUpdateGeneSearchIndices = async (modelNames) => {
  const modelsWithVariantChanges = await Model.find({
    name: { $in: modelNames },
    variants_modified: true,
  });

  if (modelsWithVariantChanges.length) {
    await updateGeneSearchIndicies();
    // Reset the `variants_modified` flag to false now that gene search indices have been updated
    await Model.updateMany(
      { name: { $in: modelNames }, variants_modified: true },
      { $set: { variants_modified: false } },
    );
  }
};

export const indexOneToES = async (filter) => {
  try {
    const validation = await getPublishValidation();
    const doc = await Model.findOne(filter)
      .populate('variants.variant')
      .populate('matchedModels')
      .exec();

    // Validate doc against publish schema for "on-demand" publishing
    await validation.validate(doc);
    // Need to populate and filter the matched models, and format data for indexing
    const data = await formatModelToDocument(doc);

    // Index model into ElasticSearch
    await indexModel(doc._id, data);
    await indexLastUpdated();

    const res = await Model.updateOne({ name: doc.name }, { status: modelStatus.published });

    logger.info({ model: doc.name }, 'publish model', 'Model Published to ES');
    return {
      status: `Indexing successful with status: ${res.result}`,
    };
  } catch (err) {
    logger.error('Error at indexOneToES', err);
    throw err;
  }
};

/**
 * Provided a Model Name, this will find the matched model set for that model, and re-publish all other
 *  members of that matched set.
 * This is needed since when a model in a set is published all members of that set need to have their
 *  matched model content updated to include the new published details.
 * @param String updatedModelName is the Name of a model, all the other published members of its
 *  matchedModel set will be republished.
 */
export const indexMatchedModelsToES = async (filter, skipSelf = true) => {
  const model = await Model.findOne(filter).populate('matchedModels');

  // Get list of matched models if exists
  const matchedModelIds = model.matchedModels ? model.matchedModels.models : [];
  if (model.matchedModels && matchedModelIds.length <= 1) {
    // if list of matched models exists but only includes itself, we can remove the whole matched model set.
    logger.warn(
      `Model ${model.name} is part of a small or empty matchedModel set of length ${matchedModelIds.length}, deleting the set and the reference in the model.`,
    );
    await MatchUtils.removeFromSet(model.name);
  }

  if (model.updateOldMatchesOnPublish) {
    // if we need to update old matches, we can do that here
    matchedModelIds.push(...model.updateOldMatchesOnPublish);
  }

  await updateMatchedModelsToES({
    _id: {
      $in: matchedModelIds.filter((id) => id.toString() !== model._id.toString() || !skipSelf),
    },
  });

  if (model.updateOldMatchesOnPublish) {
    // Remove the updateMatchedModels list now that we've updated them.
    await Model.updateOne(filter, { updateOldMatchesOnPublish: [] });
  }
};

export const updateMatchedModelsToES = async (filter) => {
  const models = await Model.find(filter);

  // filter this list only to models that are published or published with changes
  const modelsToPublish = models.filter((model) => model.status !== modelStatus.unpublished);

  logger.debug(
    { matchedModels: modelsToPublish.map((model) => model.name) },
    'Updating matched models',
  );
  for (let model of modelsToPublish) {
    // Publish this model to ensure it has matchedModel updates, unless skepSelf is true and this model is the one named in the method argument name
    logger.debug({ model: model.name }, `Publishing model in order to update Matched Models.`);
    await indexOneToES({ name: model.name });
  }
};
