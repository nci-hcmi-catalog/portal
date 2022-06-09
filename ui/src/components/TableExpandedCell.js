import React from 'react';
import { css } from '@emotion/react';
import theme from 'theme';

const TableExpandedCell = ({ sqon, savedSetsContext, state, value, history }) => {
  return (
    <span
      css={css`
        color: ${value ? theme.keyedPalette.elmDark : theme.keyedPalette.tiaMariaDark};
      `}
    >
      {value ? 'EXPANDED'.toUpperCase() : value === null ? '' : 'UNEXPANDED'}
    </span>
  );
};

export default TableExpandedCell;
