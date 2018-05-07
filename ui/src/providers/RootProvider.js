import React from 'react';
import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';

export default ({ children }) => (
  <SavedSetsProvider>
    <SelectedModelsProvider>{children}</SelectedModelsProvider>
  </SavedSetsProvider>
);
