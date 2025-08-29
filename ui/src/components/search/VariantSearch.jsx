import React from 'react';

import GeneIcon from '~/icons/DNACircleIcon';
import SidebarTextSearch from './SidebarTextSearch';
import { searchVariants } from './services/searchService';

const VariantSearch = ({ sqon, setSQON, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header="Search by Research Somatic Variant"
    placeholder="e.g. BRAF V600E, IDH1 R132H, ..."
    ResultsIcon={GeneIcon}
    optionTransformer={(option) => {
      const details = [option.transcript_id, option.variant_id];

      return { title: option.name, details, value: option.variant_id };
    }}
    filterField="genomic_variants.variant_id"
    searchService={searchVariants}
  />
);

export default VariantSearch;
