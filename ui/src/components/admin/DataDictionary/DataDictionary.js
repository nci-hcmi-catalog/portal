import React, { useContext, useEffect } from 'react';

import { DictionaryContext } from './DictionaryController';
import DictionaryHeader from './DictionaryHeader';
import DictionarySidebar from './DictionarySidebar';
import DictionaryFieldValues from './DictionaryFieldValues';
import DictionaryDependentFieldValues from './DictionaryDependentFieldValues';

import { getDictionaryDraft } from './../helpers/dictionary';

import { AdminContainer } from 'theme/adminStyles';
import { AdminDictionaryContent } from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

const mainTabWidth = 280;

const DataDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);

  useEffect(() => {
    getDictionaryDraft().then(dictionaryData => {
      let isDraft = dictionaryData.created_at !== dictionaryData.updated_at,
        totalEdits = 0,
        totalNew = 0;

      if (isDraft) {
        dictionaryData.fields &&
          dictionaryData.fields.forEach(field => {
            if (field.stats && field.stats.edited) {
              totalEdits += field.stats.edited;
            }
            if (field.stats && field.stats.new) {
              totalNew += field.stats.new;
            }
          });
      }

      setState({
        ...state,
        dictionary: dictionaryData,
        isDraft,
        totalEdits,
        totalNew,
      });
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
