import React from 'react';
import SavedSetsProvider from './SavedSets';
import SelectedModelsProvider from './SelectedModels';
import ModalStateProvider from './ModalState';

export default ({ children }) => (
  <SavedSetsProvider>
    <SelectedModelsProvider>
      <ModalStateProvider>{children}</ModalStateProvider>
    </SelectedModelsProvider>
  </SavedSetsProvider>
);
