import Model from '../schemas/model';
import { modelStatus } from '../helpers/modelStatus';
import Gene from '../schemas/genes';
import VariantImporter from '../services/gdc-importer/VariantImporter';
import { GDC_MODEL_STATES, IMPORT_ERRORS, BASE_GDC_URL } from '../services/gdc-importer/gdcConstants';

import getLogger from '../logger';
const logger = getLogger('helpers/genomicVariants');

export const clearGenomicVariants = async name => {
  // Stop any active imports, if any:
  try {
    await VariantImporter.stopImport(name);
  } catch (e) {
    logger.error(
      `Error while stopping a running GDC Variant import for ${name} - recording error but continuing to clear model variants.`,
      e,
    );
  }

  const model = await Model.findOne({ name });
  if (model) {
    model.genomic_variants = [];
    model.gene_metadata = {};
    model.status =
      model.status === modelStatus.unpublished
        ? modelStatus.unpublished
        : modelStatus.unpublishedChanges;
    model.variants_modified = true;
    await model.save();
    return model;
  } else {
    return false;
  }
};

const titleCase = (text, filter = i => true) => {
  return text.replace(/\w\S*/g, i => {
    if (filter(i)) {
      return i.charAt(0).toUpperCase() + i.substr(1);
    }
  });
};

const buildVariantId = ({
  chromosome,
  type,
  start_position,
  end_position,
  reference_allele,
  tumor_allele,
}) => {
  switch (type) {
    case 'SNP':
      return `${chromosome}:g.${start_position}${reference_allele}>${tumor_allele}`;
    case 'DEL':
      return `${chromosome}:g.${start_position}del${reference_allele}`;
    case 'INS':
      return `${chromosome}:g.${start_position}_${end_position}ins${tumor_allele}`;
    case 'ONP':
    case 'TNP':
      return `${chromosome}:g.${start_position}_${end_position}delins${tumor_allele}`;
    default:
      return `${chromosome}:g.${start_position}_${end_position}${type.toLowerCase()}${tumor_allele}`;
  }
};

const buildModelUrl = caseId => `${BASE_GDC_URL}/cases/${caseId}`;
const buildMafUrl = fileId => `${BASE_GDC_URL}/files/${fileId}`;
// URL encoded: /repository?facetTab=files&filters={"op":"and","content":[{"op":"in","content":{"field":"cases.case_id","value":["caseId"]}}]}&searchTableTab=files
const buildSequenceUrl = caseId =>
  `${BASE_GDC_URL}/repository?facetTab=files&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%22${caseId}%22%5D%7D%7D%5D%7D&searchTableTab=files`;

export const addGenomicVariantsFromMaf = async (name, mafData, { filename, fileId }, caseId) => {
  const model = await Model.findOne({ name });
  if (model) {
    const genomicVariants = [];
    const geneMeta = { filename, file_id: fileId, import_date: Date.now() };

    for (let i = 0; i < mafData.length; i++) {
      // For loop not forEach since we need async within this loop
      const row = mafData[i];

      const ensemble_id = row.Gene;
      if (!ensemble_id) {
        continue;
      }
      const aa_change = (row.HGVSp_Short || '').replace(/^p\./, '');
      const type = row.Variant_Type;
      const transcript_id = row.Transcript_ID;
      const variant_class = titleCase(row.VARIANT_CLASS);
      const consequence_type = titleCase((row.Consequence || '').replace(/_/g, ' '));
      const chromosome = row.Chromosome;
      const start_position = row.Start_Position;
      const end_position = row.End_Position;
      const specific_change = (row.HGVSc || '').replace(/^c\.[0-9]*(-[0-9]+)?/, '');
      const classification = (row.Variant_Classification || '').replace(/_/g, ' ');
      const entrez_id = row.Entrez_Gene_Id;

      const reference_allele = row.Reference_Allele;
      const tumor_allele = row.Tumor_Seq_Allele2;

      // Properties originally from Reference that are temporarily taken from MAF - Jon Eubank 2020-09-29
      const gene = row.Hugo_Symbol;
      const gene_biotype = titleCase(row.BIOTYPE.replace(/_/g, ' '), i => !i.includes('RNA'));
      const name = `${row.Hugo_Symbol} ${aa_change}`;
      const synonyms = [];

      const variant_id = buildVariantId({
        chromosome,
        type,
        start_position,
        end_position,
        reference_allele,
        tumor_allele,
      });

      const variant = {
        ensemble_id,
        aa_change,
        transcript_id,
        type,
        class: variant_class,
        consequence_type,
        chromosome,
        start_position,
        end_position,
        specific_change,
        classification,
        entrez_id,
        variant_id,
        gene,
        gene_biotype,
        synonyms,
        name,
      };

      /* This section is the original code for defining the genomic variant data using the Gene Reference library.
       *   This is removed because it was learned that the latest gene reference version is ahead of the GDC data
       *   that we are importing. GDC plans to update their Gene Reference to match, so in the future this can be used again.
       *   
      const geneReference = await Gene.findOne({ _gene_id: ensemble_id });
      if (geneReference) {
        variant.gene = geneReference.symbol;
        variant.gene_biotype = titleCase(
          geneReference.biotype.replace(/_/g, ' '),
          i => !i.includes('RNA'),
        );
        variant.gene_name = geneReference.name;
        variant.synonyms = geneReference.synonyms;
        variant.name = variant.aa_change ? `${variant.gene} ${variant.aa_change}` : variant.gene;
      } else {
        logger.warn(
          { ensemble_id, model: name },
          'Unable to find gene in gene reference by Enseble ID',
        );
        variant.gene = 'Unknown';
        variant.gene_biotype = 'Unknown';
        variant.gene_name = 'Unknown'; //row.Hugo_Symbol;
        variant.synonyms = [];
        variant.name = 'Unknown'; //row.Hugo_Symbol;
      }
      */

      genomicVariants.push(variant);
    }

    model['genomic_variants'] = genomicVariants;
    model.gene_metadata = geneMeta;
    model.status =
      model.status === modelStatus.unpublished
        ? modelStatus.unpublished
        : modelStatus.unpublishedChanges;
    model.somatic_maf_url = buildMafUrl(fileId);
    model.variants_modified = true;

    if (caseId) {
      model.source_model_url = buildModelUrl(caseId);
      model.source_sequence_url = buildSequenceUrl(caseId);
    }

    await model.save();
    logger.audit(
      {
        model: model.name,
        genomic_variants: model.genomic_variants ? model.genomic_variants.length : 0,
      },
      'model saved',
      'Genomic Variants added to model',
    );
  } else {
    logger.warn({ name }, 'Could not find model for genomic variant import');
    throw new Error('Model could not be found');
  }
};

export const getGdcImportErrorMessage = (mafStatus, modelName) => {
  switch (mafStatus) {
    case GDC_MODEL_STATES.modelNotFound:
      return `${modelName} was not found in GDC.`;
    case GDC_MODEL_STATES.noMafs:
      return `${modelName} was found in GDC, but no MAF files were found.`;
    case GDC_MODEL_STATES.singleNgcmPlusEngcm:
      return `${modelName} was found in GDC, but other unexpected MAF files were found.`;
    case GDC_MODEL_STATES.multipleNgcm:
      return `${modelName} was found in GDC, but more than one Next Generation Cancer Model MAF files were found.`;
    case GDC_MODEL_STATES.noNgcm:
      return `${modelName} was found in GDC, but only Expanded Next Generation Cancel Model MAF file(s) were found.`;
    case IMPORT_ERRORS.noMatchingModel:
      return `No local model found with matching name ${modelName}.`;
    default:
      return `${modelName} was found in GDC and a single Next Generation Cancer Model MAF file was found for it.`;
  }
};
