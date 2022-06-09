import React from 'react';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import {
  Header as HeaderWrapper,
  HeaderLinkWrapper,
  HeaderLink,
  subheadingStyle,
} from 'theme/headerStyles';

const Header = ({ subheading = 'Searchable Catalog' }) => {
  const { resetShowUnexpanded } = useExpandedUnexpanded();

  return (
    <HeaderWrapper>
      <HeaderLinkWrapper>
        <HeaderLink onClick={() => resetShowUnexpanded()} to="/">
          Human Cancer Models Initiative
        </HeaderLink>
      </HeaderLinkWrapper>
      <div css={subheadingStyle}>{subheading}</div>
    </HeaderWrapper>
  );
};

export default Header;
