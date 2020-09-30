import esClient from './common/client';
import Gene from '../../schemas/genes';

import { get, flatten, uniq } from 'lodash';

import getLogger from '../../logger';
const logger = getLogger('services/elastic-search/genomicVariants');

const MODEL_INDEX = process.env.ES_INDEX;
const GENES_INDEX = 'genes';
const VARIANTS_INDEX = 'genomic_variants';

const getAllIndexedDocs = async index => {
  let output = [];
  let startFrom = 0;
  let totalHits = 1;
  const requestSize = 100;
  while (totalHits > startFrom) {
    const esResponse = await esClient.search({
      index: index,
      size: requestSize,
      from: startFrom,
    });
    totalHits = esResponse.body.hits.total.value;

    output = output.concat(get(esResponse, 'body.hits.hits', []));
    startFrom += requestSize;
  }

  return output;
};

// NOTE: For Gene and Variant Index updates -
//   We are getting the list of genes/variants that should be published from the models in ES because we
//   can't be sure what is published for a model in draft form (changes not yet published)
//   Additionally, to know which genes to remove we have to compare this list to the currently published list in the genes index on ES

const updateVariantIndex = async desiredVariants => {
  logger.debug({ desiredVariants }, 'List of Variants that should be published');

  const variantIds = desiredVariants.map(v => v.variant.variant_id);

  // 1. get list of variants published in ES
  const variantsResponse = await getAllIndexedDocs(VARIANTS_INDEX);

  const publishedVariants = variantsResponse.map(variant => variant._source.variant_id);
  logger.debug({ publishedVariants }, 'List of Variants currently published');

  // 2. find list of variants to unpublish and genes to publish
  const removeVariants = publishedVariants.filter(variant => !variantIds.includes(variant));
  logger.debug({ removeVariants }, 'Variants to unpublish');

  const addVariants = desiredVariants.filter(
    v => !publishedVariants.includes(v.variant.variant_id),
  );
  logger.debug({ addVariants }, 'Variants to publish');

  // 3. do the publish/unpublish operations
  const deleteRequests = removeVariants.map(variant => ({
    delete: { _index: VARIANTS_INDEX, _id: variant },
  }));

  const addRequests = flatten(
    addVariants.map(v => {
      const doc = {
        name: v.variant.name,
        transcript_id: v.variant.transcript_id,
        variant_id: v.variant.variant_id,
      };

      return [
        {
          index: {
            _index: VARIANTS_INDEX,
            _id: v.variant.variant_id,
          },
        },
        doc,
      ];
    }),
  );

  if (deleteRequests.length || addRequests.length) {
    await esClient.bulk({
      body: [...deleteRequests, ...addRequests],
    });
  } else {
    logger.debug('No updates for Genomic Variants search index');
  }
};

const updateGeneIndex = async desiredGenes => {
  const desiredGeneIds = desiredGenes.map(gene => gene.symbol);
  logger.debug({ desiredGenes: desiredGeneIds }, 'List of Genes that should be published');

  // 1. get list of genes published in ES
  const genesResponse = await getAllIndexedDocs(GENES_INDEX);

  const publishedGenes = genesResponse.map(i => i._id);
  logger.debug({ publishedGenes }, 'List of Genes currently published');

  // 2. find list of genes to unpublish and genes to publish
  const removeGenes = uniq(publishedGenes.filter(gene => !desiredGeneIds.includes(gene)));
  logger.debug({ removeGenes }, 'Genes to unpublish');

  const addGenes = uniq(
    desiredGenes.filter(gene => !publishedGenes.includes(gene.symbol)),
    'symbol',
  );
  logger.debug({ addGenes }, 'Genes to publish');

  // 3. do the publish/unpublish operations

  const deleteRequests = removeGenes.map(gene => ({ delete: { _index: GENES_INDEX, _id: gene } }));

  const addRequests = flatten(
    desiredGenes.map(gene => {
      return [
        {
          index: {
            _index: GENES_INDEX,
            _id: gene.symbol,
          },
        },
        gene,
      ];
    }),
  );

  if (deleteRequests.length || addRequests.length) {
    await esClient.bulk({
      body: [...deleteRequests, ...addRequests],
    });
  } else {
    logger.debug('No updates for Gene search index.');
  }
};

export const updateGeneSearchIndicies = async () => {
  // This method reads from the es indices, and is prone to errors if we read it before updates have been indexed
  //   so first, we refresh the model index :)
  await esClient.indices.refresh({ index: MODEL_INDEX });

  // 1. get models from ES
  const publishedModels = await getAllIndexedDocs(MODEL_INDEX);

  // 1a. collect set of genes and variants from those model variants
  const desiredGenomicVariants = flatten(
    publishedModels.map(model => {
      return (model._source.genomic_variants || []).map(variant => ({
        variant: {
          transcript_id: variant.transcript_id,
          variant_id: variant.variant_id,
          name: variant.name,
        },
        gene: {
          ensemble_id: variant.ensemble_id,
          symbol: variant.gene,
        },
      }));
    }),
  );

  const clinicalVariantGenes = flatten(
    publishedModels.map(model => flatten(model._source.variants.map(variant => variant.genes))),
  );
  logger.debug({ clinicalVariantGenes }, 'Genes found in published model variants');

  // Filter the list of clinical variants to only have the names missing from the genomic variants list
  const desiredGeneSymbols = desiredGenomicVariants.map(i => i.gene.symbol);
  const additionalGenesFromClinical = clinicalVariantGenes
    .filter(clinicalGene => !desiredGeneSymbols.includes(clinicalGene))
    .map(gene => ({ symbol: gene }));

  const desiredGenes = desiredGenomicVariants.map(i => i.gene).concat(additionalGenesFromClinical);

  await updateGeneIndex(desiredGenes);
  await updateVariantIndex(desiredGenomicVariants);
};
