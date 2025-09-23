import { useContext, useEffect } from 'react';

import { AdminDictionaryContent, DictionaryContainer } from '~/theme/adminDictionaryStyles';
import { Row } from '~/theme/system';

import { getDictionaryDraft } from '../helpers/dictionary';

import { DictionaryContext } from './DictionaryController';
import DictionaryHeader from './DictionaryHeader';
import DictionarySidebar from './DictionarySidebar';
import DictionaryFieldValues from './DictionaryFieldValues';
import DictionaryDependentFieldValues from './DictionaryDependentFieldValues';

const mainTabWidth = 280;

const DataDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);

  useEffect(() => {
    getDictionaryDraft().then((dictionaryData) =>
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
