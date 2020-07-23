import React from 'react';
import { css } from 'emotion';

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
}) => (
  <div
    className={` ${css`
      cursor: pointer;
      display: flex;
      background-color: ${optionIndex % 2 === 1 ? theme.keyedPalette.whisper : 'white'};
      border-radius: ${dropdownBorderRadius};
      :hover {
        box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
      }
    `}`}
    onMouseDown={onMouseDown}
  >
    <div
      className={css`
        padding: 6px;
      `}
    >
      {OptionIcon ? <OptionIcon height={20} width={20} fill={theme.keyedPalette.crimson} /> : null}
    </div>
    <div
      style={{
        fontSize: '12px',
        padding: '3px',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      <div>
        {isArray(details)
          ? details.map(detail => (
              <>
                <span>{detail}</span>
                <br />
              </>
            ))
          : details}
      </div>
      <div className="">
        {/* <TextHighlight
          highlightClassName={`quick-search-result-value-highlight ${css`
          font-weight: bold;
          `}`}
          highlightText={searchText}
          content={text}
        /> */}
      </div>
    </div>
  </div>
);

export default ({ onSelect, options, icon, ...props }) => {
  return (
    <div
      className={css`
        margin-top: -10px;
        padding-top: 10px;
        border: ${theme.keyedPalette.bombay} 1px solid;
        border-top: none;
        border-radius: 0 0 ${dropdownBorderRadius} ${dropdownBorderRadius};
      `}
    >
      {options.map((option, index) => (
        <DropdownItem
          key={`dropdown-item-${option.value}`}
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
