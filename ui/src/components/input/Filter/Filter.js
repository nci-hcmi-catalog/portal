import React, { useEffect, useRef, useState } from 'react';

import FilterIcon from 'icons/FilterIcon';
import XIcon from 'icons/XIcon';

import {
  inputWrapperStyle,
  inputIconStyle,
  inputStyle,
  inputButtonStyle,
  inputDropdownButtonStyle,
} from 'theme/searchStyles';

export default ({ onFilterValueChange }) => {
  const didMountRef = useRef(false);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    // using a ref to mimic 'componentDidUpdate' behaviour (avoids running this on initial mount)
    if (didMountRef && didMountRef.current && onFilterValueChange) {
      onFilterValueChange(filterValue);
    } else {
      didMountRef.current = true;
    }
  }, [filterValue]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
      css={inputWrapperStyle}
    >
      <span css={inputIconStyle}>
        <FilterIcon fill={'#b2b7c1'} height={16} width={16} />
      </span>
      <input
        type="text"
        placeholder="Filter"
        value={filterValue}
        onChange={({ target: { value } }) => {
          setFilterValue(value);
        }}
        css={inputStyle}
        style={{
          border: 'none',
          flex: 1,
        }}
      />
      {filterValue && filterValue.length > 0 && (
        <button
          css={`
            ${inputIconStyle}
            ${inputButtonStyle}
            ${inputDropdownButtonStyle}
          `}
          style={{
            position: 'absolute',
            right: 0,
            margin: '0 6px 0 0',
            padding: 0,
            border: 'none',
            height: 'unset',
            width: 'unset',
          }}
          onClick={e => {
            e.preventDefault();
            setFilterValue('');
          }}
        >
          <XIcon
            height={16}
            width={16}
            fill={'#64666a'}
            style={{
              margin: 0,
              padding: '4px',
              border: '1px solid #64666a',
              borderRadius: '100%',
              cursor: 'pointer',
            }}
          />
        </button>
      )}
    </div>
  );
};
