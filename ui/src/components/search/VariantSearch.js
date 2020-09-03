import React from 'react';

import SidebarTextSearch from 'components/search/SidebarTextSearch';

import GeneIcon from 'icons/DNAIcon';
import { searchVariants } from 'components/search/services/searchService';

export default ({ sqon, setSQON, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header="Search by Research Somatic Variant"
    placeholder="e.g. BRAF V600E, IDH1 R132H, ..."
    ResultsIcon={GeneIcon}
    optionTransformer={option => {
      const details = [option.transcript_id, option.variant_id];

      return { title: option.name, details, value: option.variant_id };
    }}
    filterField="genomic_variants.variant_id"
    searchService={searchVariants}
  />
);
