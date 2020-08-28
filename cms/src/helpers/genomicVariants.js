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
    model['genomic_variants'] = [];
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

export const addGenomicVariantsFromMaf = async (name, mafData) => {
  const model = await Model.findOne({ name });
  if (model) {
    const genomicVariants = [];

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
      const variant_class = row.VARIANT_CLASS;
      const consequence_type = titleCase((row.Consequence || '').replace(/_/g, ' '));
      const chromosome = row.Chromosome;
      const start_position = row.Start_Position;
      const end_position = row.End_Position;
      const specific_change = (row.HGVSc || '').replace(/^c\.[0-9]*(-[0-9]+)?/, '');
      const classification = (row.Variant_Classification || '').replace(/_/g, ' ');
      const entrez_id = row.Entrez_Gene_Id;

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
      };

      const geneReference = await Gene.findOne({ _gene_id: ensemble_id });
      if (geneReference) {
        variant.gene = geneReference.symbol;
        variant.gene_biotype = titleCase(
          geneReference.biotype.replace(/_/g, ' '),
          i => !i.includes('RNA'),
        );
        variant.gene_name = geneReference.name;
        variant.synonyms = geneReference.synonyms;
      } else {
        logger.warn(
          { ensemble_id, model: name },
          'Unable to find gene in gene reference by Enseble ID',
        );
      }

      genomicVariants.push(variant);
    }

    model['genomic_variants'] = genomicVariants;
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
