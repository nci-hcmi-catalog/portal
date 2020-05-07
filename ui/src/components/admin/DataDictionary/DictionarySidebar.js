import React from 'react';

import { useDictionary } from './DictionaryController';

import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';

const DictionarySidebar = ({ width }) => {
  const label = 'Editable Fields';
  const { activeField, dictionary, setActiveField } = useDictionary();

  return (
    <TabGroup groupName={label} width={width}>
      {dictionary &&
        dictionary.fields &&
        dictionary.fields
          .sort((a, b) => {
            if (a.displayName < b.displayName) return -1;
            if (a.displayName > b.displayName) return 1;
            return 0;
          })
          .map(field => (
            <Tab
              key={field.name}
              heading={field.displayName}
              subheading={'0 edit | 0 new'} // TODO: edit/new per field
              dot={true} // TODO: same as above
              active={activeField === field.displayName}
              onClick={() => setActiveField(field.displayName)}
            />
          ))}
    </TabGroup>
  );
};

export default DictionarySidebar;
