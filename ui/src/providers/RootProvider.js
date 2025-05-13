import axios from 'axios';
import { ArrangerDataProvider, TableContextProvider } from '@overture-stack/arranger-components';
import React from 'react';
import urlJoin from 'url-join';
import globals from 'utils/globals';
import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';
import ModalStateProvider from './ModalState';

const arrangerFetcher = async ({
  body,
  endpoint = 'graphql',
  endpointTag = '',
  headers = {},
  method = 'POST',
}) => {
  const response = await axios(urlJoin(globals.ARRANGER_API, endpoint, endpointTag), {
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
    method,
  });
  return response.data;
};

const RootProvider = ({ children }) => (
  <ArrangerDataProvider documentType={'model'} customFetcher={arrangerFetcher}>
    <TableContextProvider>
      <SelectedModelsProvider>
        <SavedSetsProvider>
          <ModalStateProvider>{children}</ModalStateProvider>
        </SavedSetsProvider>
      </SelectedModelsProvider>
    </TableContextProvider>
  </ArrangerDataProvider>
);

export default RootProvider;
