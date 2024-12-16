import React from 'react';
import BannerContainer from 'components/banner/BannerContainer';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import { HeaderWrapper, HeaderLinkWrapper, HeaderLink, subheadingStyle } from 'theme/headerStyles';

const Header = ({ subheading = 'Searchable Catalog' }) => {
  const { resetShowUnexpanded } = useExpandedUnexpanded();

  return (
    <header>
      <BannerContainer />
      <HeaderWrapper>
        <HeaderLinkWrapper>
          <HeaderLink onClick={() => resetShowUnexpanded()} to="/">
            Human Cancer Models Initiative
          </HeaderLink>
        </HeaderLinkWrapper>
        <div css={subheadingStyle}>{subheading}</div>
      </HeaderWrapper>
    </header>
  );
};

export default Header;
