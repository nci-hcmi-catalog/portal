import axios from 'axios';
import { ArrangerDataProvider, TableContextProvider } from '@overture-stack/arranger-components';
import React from 'react';
import urlJoin from 'url-join';

import globals from 'utils/globals';
import ModalStateProvider from './ModalState';
import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';

const arrangerFetcher = async (args) => {
  const { body, endpoint = '/graphql', endpointTag = '', headers = {}, method = 'POST' } = args;

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
