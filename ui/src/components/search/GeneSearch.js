import React from 'react';

import SidebarTextSearch from 'components/search/SidebarTextSearch';

import GeneIcon from 'icons/DNAIcon';
import { searchGenes } from 'components/search/services/searchService';

export default ({ sqon, setSQON, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header="Search by Gene"
    placeholder="e.g. BRAF, EWSR, ..."
    ResultsIcon={GeneIcon}
    optionTransformer={option => {
      const details = [option.ensemble_id, option.name];
      if (option.synonyms && option.synonyms.length > 0) {
        details.push(option.synonyms.join(', '));
      }

      return { title: option.symbol, details, value: option.symbol };
    }}
    filterField="genomic_variants.gene"
    searchService={searchGenes}
  />
);
