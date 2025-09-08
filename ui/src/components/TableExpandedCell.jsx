import { css } from '@emotion/react';
import theme from '~/theme/index';

const TableExpandedCell = ({ value }) => {
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
