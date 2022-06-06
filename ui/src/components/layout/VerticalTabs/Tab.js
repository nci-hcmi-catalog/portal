import React from 'react';

import {
  Tab,
  TabContents,
  TabLabel,
  TabHeading,
  TabSubheading,
  StatusIndicator,
} from 'theme/verticalTabStyles';

const VerticalTab = ({ heading, subheading, dot, icon, ...props }) => {
  return (
    <Tab {...props}>
      <TabContents>
        <TabLabel>
          {icon}
          <TabHeading>{heading}</TabHeading>
          {subheading && (
            <TabSubheading>
              {dot && <StatusIndicator />} {subheading}
            </TabSubheading>
          )}
        </TabLabel>
      </TabContents>
    </Tab>
  );
};

export default VerticalTab;
