import React from 'react';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';

export default props => (
  <>
    <ExternalLinkIcon height={10} width={10} />
    <a className="external-link" {...props} target="_blank" rel="noopener noreferrer" />
  </>
);
