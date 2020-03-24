import React from 'react';
import theme from 'theme';

export default ({ sqon, savedSetsContext, state, value, history }) => {
  console.log('expanded data', value);
  return (
    <span
      css={`
        color: ${value ? theme.keyedPalette.green : theme.keyedPalette.redOrange};
      `}
    >
      {value ? 'EXPANDED'.toUpperCase() : value === null ? '' : 'UNEXPANDED'}
    </span>
  );
};