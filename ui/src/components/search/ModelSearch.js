import React from 'react';

import SidebarTextSearch from 'components/search/SidebarTextSearch';

import ModelIcon from 'icons/ModelIcon';
import { searchModels } from 'components/search/services/searchService';

const ModelSearch = ({ sqon, setSQON, ...props }) => (
  <SidebarTextSearch
    sqon={sqon}
    setSQON={setSQON}
    header="Search by Model Name"
    placeholder="e.g. HCM-BROD-0051-C64, ..."
    ResultsIcon={ModelIcon}
    optionTransformer={(option) => {
      const details = [option.primary_site];

      return { title: option.primaryKey, details, value: option.primaryKey };
    }}
    filterField="name"
    searchService={searchModels}
  />
);

export default ModelSearch;
