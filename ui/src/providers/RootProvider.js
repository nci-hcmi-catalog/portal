import axios from 'axios';
import React from 'react';
import urlJoin from 'url-join';
import globals from 'utils/globals';

import { ArrangerDataProvider, TableContextProvider } from '@overture-stack/arranger-components';

import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';
import ModalStateProvider from './ModalState';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';
import { toggleExpanded } from 'utils/sqonHelpers';

const arrangerFetcher = async ({
  body,
  endpoint = 'graphql',
  endpointTag = '',
  headers = {},
  method = 'POST',
  showUnexpanded = false,
}) => {
  const response = await axios(urlJoin(globals.ARRANGER_API, endpoint, endpointTag), {
    data: JSON.stringify({
      ...body,
      variables: {
        ...body.variables,
        // Add expanded models filter to the SQON when fetching data from Arranger API
        // This way ArrangerContext (and SQONViewer) will never show the "expanded" SQON
        sqon: toggleExpanded(body?.variables?.sqon, showUnexpanded) || { content: [], op: 'and' },
      },
    }),
    headers: { 'Content-Type': 'application/json', ...headers },
    method,
  });
  return response.data;
};

const RootProvider = ({ children }) => {
  const { showUnexpanded } = useExpandedUnexpanded();
  return (
    <ArrangerDataProvider
      documentType={'model'}
      customFetcher={(props) => arrangerFetcher({ ...props, showUnexpanded })}
    >
      <TableContextProvider>
        <SelectedModelsProvider>
          <SavedSetsProvider>
            <ModalStateProvider>{children}</ModalStateProvider>
          </SavedSetsProvider>
        </SelectedModelsProvider>
      </TableContextProvider>
    </ArrangerDataProvider>
  );
};

export default RootProvider;
