import React from 'react';
import { css } from '@emotion/react';

import { distributorLink } from 'utils/externalReferences';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';

export default ({ sqon, savedSetsContext, state, value, history }) => {
  return value ? (
    <a
      className="clickable"
      css={css`
        background: none;
        border: none;
      `}
      href={distributorLink(value)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ExternalLinkIcon /> {value}
    </a>
  ) : null;
};
