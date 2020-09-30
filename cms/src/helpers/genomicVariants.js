import Model from '../schemas/model';
import { modelStatus } from '../helpers/modelStatus';
import Gene from '../schemas/genes';
import VariantImporter from '../services/gdc-importer/VariantImporter';

import getLogger from '../logger';
const logger = getLogger('helpers/genomicVariants');

export const clearGenomicVariants = async name => {
  // Stop any active imports, if any:
  try {
    await VariantImporter.stopImport(name);
  } catch (e) {
    console.log(
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

export const addGenomicVariantsFromMaf = async (name, mafData, { filename, fileId }) => {
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

    await model.save();
    logger.audit({ model }, 'model saved', 'Genomic Variants added to model');
  } else {
    logger.warn({ name }, 'Could not find model for genomic variant import');
    throw new Error('Model could not be found');
  }
};
