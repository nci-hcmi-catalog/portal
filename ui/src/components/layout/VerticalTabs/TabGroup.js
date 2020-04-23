import React, { useState } from 'react';
import Tab from './Tab';

import { Divider, VerticalTabGroup } from 'theme/verticalTabStyles';

const TabGroup = ({ groupName, tabs, initialActive }) => {
  const [activeTab, setActiveTab] = useState(initialActive || null);

  return (
    <VerticalTabGroup width={280}>
      {groupName && <Divider>{groupName}</Divider>}
      {tabs &&
        tabs.map(tab => (
          <Tab
            key={tab.id}
            heading={tab.heading}
            subheading={tab.subheading}
            icon={tab.icon}
            dot={tab.dot}
            active={activeTab === tab.id}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
          />
        ))}
    </VerticalTabGroup>
  );
};

export default TabGroup;
