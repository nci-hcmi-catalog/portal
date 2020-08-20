import React, { useState } from 'react';
import { css } from 'emotion';
import Spinner from 'react-spinkit';
import SearchIcon from 'react-icons/lib/fa/search';

import { Col } from 'theme/system';
import TextInput from 'components/TextInput';
import SidebarSection from 'components/search/SidebarSection';
import SearchOptionsDropdown from 'components/search/SearchOptionsDropdown';

import * as SQONUtils from '@arranger/components/dist/SQONView/utils';

const LoadingIcon = (
  <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
);

export default ({
  sqon,
  setSQON,
  header,
  placeholder,
  ResultsIcon,
  optionTransformer, // optionTransformer = (option) => ({title, details, value})
  filterField,
  searchService,
  resultSize = 5,
  ...props
}) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(true);

  return (
    <SidebarSection title={header}>
      <Col style={{ width: '100%' }}>
        <TextInput
          css={{ border: 'none', flex: ' 1 1 0%' }}
          aria-label={header}
          placeholder={placeholder}
          value={value}
          icon={loading ? LoadingIcon : <SearchIcon />}
          onFocus={() => {
            setShowOptions(!!options);
          }}
          onBlur={() => {
            setShowOptions(false);
          }}
          onChange={async e => {
            const inputValue = e.target.value;
            setValue(inputValue);

            if (inputValue) {
              setLoading(true);
              const searchResults = await searchService(inputValue);

              const searchOptions = searchResults.slice(0, resultSize).map(optionTransformer);
              setOptions(searchOptions);
              setShowOptions(true);
              setLoading(false);
            } else {
              setOptions([]);
              setShowOptions(false);
            }
          }}
        />
        {showOptions && options.length > 0 && (
          <div
            className={css`
              position: relative;
            `}
          >
            <div
              className={`${css`
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
                padding: 0;
                z-index: 1;
                background: white;
                width: 100%;
              `}`}
            >
              <SearchOptionsDropdown
                options={options}
                icon={ResultsIcon}
                onSelect={selected => {
                  setValue(selected);

                  const query = {
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: filterField,
                          value: [selected],
                        },
                      },
                    ],
                  };
                  const clearedSqon = SQONUtils.removeSQON(filterField, sqon);
                  const newSqon = selected ? SQONUtils.addInSQON(query, clearedSqon) : clearedSqon;
                  setSQON(newSqon);
                }}
              />
            </div>
          </div>
        )}
      </Col>
    </SidebarSection>
  );
};
