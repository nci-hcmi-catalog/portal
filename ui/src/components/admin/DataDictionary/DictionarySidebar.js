/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import { useDictionary } from './DictionaryController';
import { EDITABLE_FIELDS } from './../helpers/dictionary';

import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';

const DictionarySidebar = ({ width }) => {
  const label = 'Editable Fields';
  const { activeField, dictionary, setActiveField } = useDictionary();

  const generateStatsString = (field) => {
    return field && field.stats
      ? `${field.stats.edited || 0} edited | ${field.stats.new || 0} new`
      : null;
  };

  useEffect(() => {
    if (activeField === '' && dictionary && dictionary.fields && dictionary.fields.length > 0) {
      let firstField = dictionary.fields.sort((a, b) => {
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
        return 0;
      })[0];

      setActiveField(firstField.displayName, firstField.name);
    }
  }, [activeField, dictionary]);

  return (
    <TabGroup groupName={label} width={width}>
      {dictionary &&
        dictionary.fields &&
        dictionary.fields
          .filter((field) => EDITABLE_FIELDS.indexOf(field.name) > -1)
          .sort((a, b) => {
            if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) return -1;
            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) return 1;
            return 0;
          })
          .map((field) => (
            <Tab
              key={field._id}
              heading={field.displayName}
              subheading={generateStatsString(field)}
              dot={generateStatsString(field)}
              active={activeField === field.displayName}
              onClick={() => setActiveField(field.displayName, field.name)}
            />
          ))}
    </TabGroup>
  );
};

export default DictionarySidebar;
