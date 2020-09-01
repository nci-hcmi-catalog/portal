import React from 'react';

import { distributorLink } from 'utils/externalReferences';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';

export default ({ sqon, savedSetsContext, state, value, history }) => {
  return value ? (
    <a
      className="clickable"
      css={`
        background: none;
        border: none;
      `}
      href={distributorLink(value)}
      target="_blank"
    >
      <ExternalLinkIcon /> {value}
    </a>
  ) : null;
};
