import React from 'react';

import SidebarTextSearch from 'components/search/SidebarTextSearch';

import GeneIcon from 'icons/DNAIcon';
import { searchVariants } from 'components/search/services/searchService';

export default ({ sqon, setSQON, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header="Search by Genomic Variant"
    placeholder="e.g. BRAF V600E, IDH1 R132H, ..."
    ResultsIcon={GeneIcon}
    optionTransformer={option => {
      const details = [option.transcript_id, option.variant_id];

      return { title: option.name, details, value: option.transcript_id };
    }}
    filterField="genomic_variants.transcript_id"
    searchService={searchVariants}
  />
);
