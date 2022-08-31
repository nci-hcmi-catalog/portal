import React, { useState } from 'react';
import { css } from '@emotion/react';
import Spinner from 'react-spinkit';
import SearchIcon from 'react-icons/lib/fa/search';

import { Col } from 'theme/system';
import TextInput from 'components/TextInput';
import SidebarSection from 'components/search/SidebarSection';
import SearchOptionsDropdown from 'components/search/SearchOptionsDropdown';

import * as SQONUtils from '@arranger/components/dist/SQONView/utils';

const LoadingIcon = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    css={css`
      width: 15px;
      height: 15px;
    `}
  />
);

const SidebarTextSearch = ({
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
      <Col
        css={css`
          width: 100%;
        `}
      >
        <TextInput
          css={css`
            border: none;
            flex: 1 1 0%;
          `}
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
            css={css`
              position: relative;
            `}
          >
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
                padding: 0;
                z-index: 1;
                background: white;
                width: 100%;
              `}
            >
              <SearchOptionsDropdown
                options={options}
                icon={ResultsIcon}
                onSelect={selected => {
                  const currentFilterValues =
                    sqon && sqon.content
                      ? (
                          sqon.content.find(i => i.content.field === filterField) || {
                            content: { value: [] },
                          }
                        ).content.value
                      : [];

                  const query = {
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: filterField,
                          value: [...currentFilterValues, selected],
                        },
                      },
                    ],
                  };

                  const clearedSqon = SQONUtils.removeSQON(filterField, sqon);
                  const newSqon = selected ? SQONUtils.addInSQON(query, clearedSqon) : clearedSqon;
                  setSQON(newSqon);
                  setValue('');
                }}
              />
            </div>
          </div>
        )}
      </Col>
    </SidebarSection>
  );
};

export default SidebarTextSearch;
