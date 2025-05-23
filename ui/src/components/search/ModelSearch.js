import React from 'react';
import { useArrangerData } from '@overture-stack/arranger-components/';

import ModelIcon from 'icons/ModelIcon';
import SidebarTextSearch from 'components/search/SidebarTextSearch';
import { searchModels } from 'components/search/services/searchService';

const ModelSearch = ({ sqon, setSQON, ...props }) => {
  const context = useArrangerData({
    callerName: `ModelSearch`,
  });
  const { apiFetcher } = context;

  return (
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
      searchService={async (value) => await searchModels(value, apiFetcher)}
    />
  );
};

export default ModelSearch;
