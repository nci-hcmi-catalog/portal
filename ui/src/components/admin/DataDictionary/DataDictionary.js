import React, { useContext, useEffect } from 'react';

import { DictionaryContext } from './DictionaryController';
import DictionaryHeader from './DictionaryHeader';
import DictionarySidebar from './DictionarySidebar';
import DictionaryFieldValues from './DictionaryFieldValues';
import DictionaryDependentFieldValues from './DictionaryDependentFieldValues';

import { AdminContainer } from 'theme/adminStyles';
import { AdminDictionaryContent } from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

import dictionaryData from './dictionaryData';

const mainTabWidth = 280;

const DataDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);

  // TODO: replace `dictionaryData` with response from GET request to `/api/v1/dictionary`
  useEffect(() => {
    setState({
      ...state,
      dictionary: dictionaryData,
    });
  }, []);

  return (
    <AdminContainer>
      <DictionaryHeader />
      <Row>
        <DictionarySidebar width={mainTabWidth} />
        <AdminDictionaryContent tabWidth={mainTabWidth}>
          <DictionaryFieldValues />
          <DictionaryDependentFieldValues />
        </AdminDictionaryContent>
      </Row>
    </AdminContainer>
  );
};

export default DataDictionary;
