const updateGeneIndex = async () => {
  // NOTE: We are getting the list of genes that should be published from the models in ES because we
  //   can't be sure what is published for a model in draft form (changes not yet published)
  //   Additionally, to know which genes to remove we have to compare this list to the currently published list in the genes index on ES
  // 1. get models from ES
  // 1a. collect set of genes used in those model variants
  // 2. get list of genes published in ES
  // 3. find list of genes to unpublish and genes to publish
  // 4. do the publish/unpublish operations
};
