import Model from '../schemas/model';
import VariantImporter from '../services/gdc-importer/VariantImporter';

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
