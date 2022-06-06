import React from 'react';

import DataDictionary from './DataDictionary';
import { DictionaryProvider } from './DictionaryController';

const DictionaryManager = () => {
  return (
    <DictionaryProvider>
      <DataDictionary />
    </DictionaryProvider>
  );
};

export default DictionaryManager;
