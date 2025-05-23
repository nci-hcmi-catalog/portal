import React from 'react';
import { css } from '@emotion/react';

import theme from 'theme';
import ModelIcon from 'icons/ModelIcon';

import { isArray } from 'lodash';

const dropdownBorderRadius = '6px';

export const QuickSearchDropdownItem = ({
  entityName,
  optionIndex,
  inputValue,
  result,
  primaryKey,
  onMouseDown = () => {},
  ...props
}) => (
  <DropdownItem
    title={result}
    details={[]}
    value={entityName}
    OptionIcon={ModelIcon}
    onMouseDown={onMouseDown}
    {...props}
  />
);

const DropdownItem = ({
  title,
  details,
  value,
  searchText,
  optionIndex,
  OptionIcon = null,
  onMouseDown = () => {},
  ...props
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    css={css`
      cursor: pointer;
      display: flex;
      background-color: ${optionIndex % 2 === 1 ? theme.keyedPalette.whisper : 'white'};
      border-radius: ${dropdownBorderRadius};
      :hover {
        box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
      }
    `}
    onMouseDown={onMouseDown}
    {...props}
  >
    <div
      css={css`
        padding: 6px;
      `}
    >
      {OptionIcon ? <OptionIcon height={20} width={20} fill={theme.keyedPalette.crimson} /> : null}
    </div>
    <div
      css={css`
        font-size: 12px;
        padding: 3px;
      `}
    >
      <div
        css={css`
          font-weight: bold;
        `}
      >
        {title}
      </div>
      <div>
        {isArray(details)
          ? details.map((detail) => (
              <>
                <span>{detail}</span>
                <br />
              </>
            ))
          : details}
      </div>
      {/* <div>
        <TextHighlight
          highlightClassName={`quick-search-result-value-highlight ${css`
          font-weight: bold;
          `}`}
          highlightText={searchText}
          content={text}
        />
      </div> */}
    </div>
  </div>
);

const SearchOptionsDropdown = ({ onSelect, options, icon, ...props }) => {
  return (
    <div
      css={css`
        margin-top: -10px;
        padding-top: 10px;
        border: ${theme.keyedPalette.bombay} 1px solid;
        border-top: none;
        border-radius: 0 0 ${dropdownBorderRadius} ${dropdownBorderRadius};
      `}
    >
      {options.map((option, index) => (
        <DropdownItem
          key={`dropdown-item-${option.value}-${index}`}
          title={option.title}
          details={option.details}
          value={option.value}
          optionIndex={index}
          OptionIcon={icon}
          onMouseDown={() => onSelect(option.value)}
        />
      ))}
    </div>
  );
};

export default SearchOptionsDropdown;
