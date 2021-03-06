import React from 'react';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import { Header, HeaderLinkWrapper, HeaderLink, subheadingStyle } from 'theme/headerStyles';

export default ({ subheading = 'Searchable Catalog' }) => {
  const { resetShowUnexpanded } = useExpandedUnexpanded();

  return (
    <Header>
      <HeaderLinkWrapper>
        <HeaderLink onClick={() => resetShowUnexpanded()} to="/">
          Human Cancer Models Initiative
        </HeaderLink>
      </HeaderLinkWrapper>
      <div css={subheadingStyle}>{subheading}</div>
    </Header>
  );
};
