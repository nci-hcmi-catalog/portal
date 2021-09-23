import React from 'react';

import SidebarTextSearch from 'components/search/SidebarTextSearch';

import GeneIcon from 'icons/DNACircleIcon';
import { searchGenes } from 'components/search/services/searchService';
import { AlteredGenesTooltip } from 'components/tooltips';
import { Row } from 'theme/system';

export default ({ sqon, setSQON, tooltipWidth, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header={
      <Row
        justifyContent="space-between"
        css={`
          text-transform: none;
        `}
      >
        Search By Altered Gene(s) <AlteredGenesTooltip width={tooltipWidth} />
      </Row>
    }
    placeholder="e.g. BRAF, EWSR, ..."
    ResultsIcon={GeneIcon}
    optionTransformer={option => {
      // const details = [option.ensemble_id, option.name];
      // if (option.synonyms && option.synonyms.length > 0) {
      //   details.push(option.synonyms.join(', '));
      // }
      const details = [option.ensemble_id];
      return { title: option.symbol, details, value: option.symbol };
    }}
    filterField="gene_metadata.genes"
    searchService={searchGenes}
  />
);
