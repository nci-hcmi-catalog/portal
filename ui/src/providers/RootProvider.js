import axios from 'axios';
import React from 'react';
import urlJoin from 'url-join';
import { ArrangerDataProvider } from '@overture-stack/arranger-components';
import globals from 'utils/globals';
import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';
import ModalStateProvider from './ModalState';

const arrangerFetcher = async (args) => {
  const { body, endpoint = 'graphql', endpointTag = '', headers = {}, method = 'POST' } = args;
  const response = await axios(urlJoin(globals.ARRANGER_API, endpoint, endpointTag), {
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
    method,
  });
  return response.data;
};

const RootProvider = ({ children }) => (
  <SelectedModelsProvider>
    <ArrangerDataProvider documentType={'model'} customFetcher={arrangerFetcher}>
      <SavedSetsProvider>
        <ModalStateProvider>{children}</ModalStateProvider>
      </SavedSetsProvider>
    </ArrangerDataProvider>
  </SelectedModelsProvider>
);

export default RootProvider;
