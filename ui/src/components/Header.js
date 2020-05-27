import React from 'react';

import { Header, HeaderLink, subheadingStyle } from 'theme/headerStyles';

export default ({ subheading = 'Searchable Catalog' }) => (
  <Header>
    <HeaderLink to="/">Human Cancer Models Initiative</HeaderLink>
    <div css={subheadingStyle}>{subheading}</div>
  </Header>
);
