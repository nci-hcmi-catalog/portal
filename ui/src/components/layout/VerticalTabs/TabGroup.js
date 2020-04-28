import React from 'react';

import { Divider, VerticalTabGroup } from 'theme/verticalTabStyles';

const TabGroup = ({ children, groupName, width }) => {
  return (
    <VerticalTabGroup width={width}>
      {groupName && <Divider>{groupName}</Divider>}
      {children}
    </VerticalTabGroup>
  );
};

export default TabGroup;
