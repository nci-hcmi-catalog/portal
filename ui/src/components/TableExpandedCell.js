import React from 'react';
import theme from 'theme';

export default ({ sqon, savedSetsContext, state, value, history }) => {
  return (
    <span
      css={`
        color: ${value ? theme.keyedPalette.elm : theme.keyedPalette.tiaMaria};
      `}
    >
      {value ? 'EXPANDED'.toUpperCase() : value === null ? '' : 'UNEXPANDED'}
    </span>
  );
};
