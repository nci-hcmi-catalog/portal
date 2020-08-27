import esClient from './common/client';
import Gene from '../../schemas/genes';

import { get, flatten, uniq } from 'lodash';

import getLogger from '../../logger';
const logger = getLogger('services/elastic-search/genomicVariants');

const MODEL_INDEX = process.env.ES_INDEX;
const GENES_INDEX = 'genes';
const VARIANTS_INDEX = 'genomic_variants';

// NOTE: For Gene and Variant Index updates -
//   We are getting the list of genes/variants that should be published from the models in ES because we
//   can't be sure what is published for a model in draft form (changes not yet published)
//   Additionally, to know which genes to remove we have to compare this list to the currently published list in the genes index on ES

const updateVariantIndex = async desiredVariants => {
  console.log('List of Variants that should be published:', desiredVariants);

  const variantIds = desiredVariants.map(v => v.variant.transcript_id);

  // 1. get list of variants published in ES
  const variantsResponse = await esClient.search({
    index: VARIANTS_INDEX,
  });
  const publishedVariants = get(variantsResponse, 'body.hits.hits', []).map(
    i => i._source.transcript_id,
  );
  console.log('List of Variants currently published:', publishedVariants);

  // 2. find list of variants to unpublish and genes to publish
  const removeVariants = publishedVariants.filter(variant => !variantIds.includes(variant));
  console.log('Variants to unpublish:', removeVariants);

  const addVariants = desiredVariants.filter(
    v => !publishedVariants.includes(v.variant.transcript_id),
  );
  console.log('Variants to publish:', addVariants);

  // 3. do the publish/unpublish operations
  const deleteRequests = removeVariants.map(variant => ({
    delete: { _index: VARIANTS_INDEX, _id: variant },
  }));

  // TODO: Remove commented code once validated.
  // No lookup required, all data needed is in the published models and included in desiredVariants
  // const geneData = await Gene.find({
  //   _gene_id: { $in: uniq(desiredVariants.map(i => i.gene)) },
  // });
  const addRequests = flatten(
    addVariants.map(v => {
      // TODO: Remove commented code once validated.
      // No reference needed
      // const referenceGene = geneData.find(gene => gene._gene_id === variant.gene);
      // const referenceVariant = (referenceGene.transcripts || []).find(
      //   transcript => transcript.id === variant.variant,
      // );

      const doc = {
        name: v.variant.name,
        transcript_id: v.variant.transcript_id,
        variant_id: v.variant.variant_id,
      };

      return [
        {
          create: {
            _index: VARIANTS_INDEX,
            _id: v.variant.transcript_id,
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
    console.log('No updates for Genomic Variants search index.');
  }
};

const updateGeneIndex = async desiredGenes => {
  logger.debug({ desiredGenes }, 'List of Genes that should be published');

  // 1. get list of genes published in ES
  const genesResponse = await esClient.search({
    index: GENES_INDEX,
  });

  const publishedGenes = get(genesResponse, 'body.hits.hits', []).map(i => i._source.ensemble_id);
  console.log('List of Genes currently published:', publishedGenes);

  // 2. find list of genes to unpublish and genes to publish
  const removeGenes = publishedGenes.filter(gene => !desiredGenes.includes(gene));
  console.log('Genes to unpublish:', removeGenes);

  const addGenes = desiredGenes.filter(gene => !publishedGenes.includes(gene));
  console.log('Genes to publish:', addGenes);

  // 3. do the publish/unpublish operations

  const deleteRequests = removeGenes.map(gene => ({ delete: { _index: GENES_INDEX, _id: gene } }));

  const geneData = await Gene.find({ _gene_id: { $in: addGenes } });
  const addRequests = flatten(
    addGenes.map(gene => {
      const reference = geneData.find(g => g._gene_id === gene);

      const doc = {
        symbol: reference.symbol,
        ensemble_id: gene,
        name: reference.name,
        synonyms: reference.synonyms,
      };

      return [
        {
          create: {
            _index: GENES_INDEX,
            _id: gene,
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
    console.log('No updates for Gene search index.');
  }
};

export const updateGeneSearchIndicies = async () => {
  // 1. get models from ES
  const modelsResponse = await esClient.search({
    index: MODEL_INDEX,
  });

  const publishedModels = get(modelsResponse, 'body.hits.hits', []).map(i => i._source);

  // 1a. collect set of genes used in those model variants
  const desiredVariants = flatten(
    publishedModels.map(model => {
      return (model.genomic_variants || []).map(variant => ({
        variant: {
          transcript_id: variant.transcript_id,
          variant_id: variant.variant_id,
          name: variant.name,
        },
        gene: variant.ensemble_id,
      }));
    }),
  );
  const desiredGenes = desiredVariants.map(v => v.gene);

  await updateGeneIndex(desiredGenes);
  await updateVariantIndex(desiredVariants);
};
