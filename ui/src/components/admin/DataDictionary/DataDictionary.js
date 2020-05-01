import React, { useState } from 'react';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { NotificationToaster } from '../Notifications';

import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';

const DataDictionary = () => {
  // using state for now, will switch this to Context in a later ticket
  const [activeTab, setActiveTab] = useState('tab-0');
  const groupName = 'Editable Fields';

  return (
    <AdminContainer>
      <NotificationToaster />
      <AdminHeader>
        <AdminHeaderH1>Data Dictionary</AdminHeaderH1>
        <AdminHeaderBlock />
      </AdminHeader>
      <TabGroup groupName={groupName} width={268}>
        <Tab
          heading="Active"
          subheading="Can set a tab to be active initially"
          active={activeTab === 'tab-0'}
          onClick={() => setActiveTab('tab-0')}
        />
        <Tab
          heading="Default Style"
          subheading="With subheading"
          active={activeTab === 'tab-1'}
          onClick={() => setActiveTab('tab-1')}
        />
        <Tab
          heading="Has Dot"
          subheading="With status indicator"
          dot={true}
          active={activeTab === 'tab-2'}
          onClick={() => setActiveTab('tab-2')}
        />
        <Tab
          heading="No Subheading"
          active={activeTab === 'tab-3'}
          onClick={() => setActiveTab('tab-3')}
        />
        <Tab
          heading="Disabled"
          subheading="No click, no hover, no problem"
          disabled={true}
          active={activeTab === 'tab-4'}
        />
      </TabGroup>
    </AdminContainer>
  );
};

export default DataDictionary;
