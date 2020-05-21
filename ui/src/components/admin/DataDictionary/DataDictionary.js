import React, { useContext, useEffect } from 'react';

import { DictionaryContext } from './DictionaryController';
import DictionaryHeader from './DictionaryHeader';
import DictionarySidebar from './DictionarySidebar';
import DictionaryFieldValues from './DictionaryFieldValues';
import DictionaryDependentFieldValues from './DictionaryDependentFieldValues';

import { getDictionaryDraft } from './../helpers/dictionary';

import { AdminDictionaryContent, DictionaryContainer } from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

const mainTabWidth = 280;

const DataDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);

  useEffect(() => {
    getDictionaryDraft().then(dictionaryData =>
      setState({
        ...state,
        dictionary: dictionaryData,
      }),
    );
  }, []);

  return (
    <DictionaryContainer>
      <DictionaryHeader />
      <Row>
        <DictionarySidebar width={mainTabWidth} />
        <AdminDictionaryContent tabWidth={mainTabWidth}>
          <DictionaryFieldValues />
          <DictionaryDependentFieldValues />
        </AdminDictionaryContent>
      </Row>
    </DictionaryContainer>
  );
};

export default DataDictionary;
