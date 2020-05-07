import React from 'react';

import DataDictionary from './DataDictionary';
import { DictionaryProvider } from './DictionaryController';

export default () => {
  return (
    <DictionaryProvider>
      <DataDictionary />
    </DictionaryProvider>
  );
};
