import React from 'react';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import { Header, HeaderLink, subheadingStyle } from 'theme/headerStyles';

export default ({ subheading = 'Searchable Catalog' }) => {
  const { resetShowUnexpanded } = useExpandedUnexpanded();

  return (
    <Header>
      <HeaderLink onClick={() => resetShowUnexpanded()} to="/">
        Human Cancer Models Initiative
      </HeaderLink>
      <div css={subheadingStyle}>{subheading}</div>
    </Header>
  );
};
