import React from 'react';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { NotificationToaster } from '../Notifications';

import TabGroup from 'components/layout/VerticalTabs';

const DataDictionary = () => {
  // temporarily hardcoding some dummy tabs
  const groupName = 'Example Vertical Tab Group';
  const tabs = [
    {
      id: 'tab-0',
      heading: 'Active',
      subheading: 'Can set a tab to be active initially',
    },
    {
      id: 'tab-1',
      heading: 'Default',
      subheading: 'With subheading',
    },
    {
      id: 'tab-2',
      heading: 'Has Dot',
      subheading: 'With status indicator | More text',
      dot: true,
    },
    {
      id: 'tab-3',
      heading: 'No Subheading',
    },
    {
      id: 'tab-4',
      heading: 'Disabled',
      subheading: 'No click, no hover, no problem',
      disabled: true,
    },
  ];

  return (
    <AdminContainer>
      <NotificationToaster />
      <AdminHeader>
        <AdminHeaderH1>Data Dictionary</AdminHeaderH1>
        <AdminHeaderBlock />
      </AdminHeader>
      <TabGroup groupName={groupName} tabs={tabs} initialActive={tabs[0].id} />
    </AdminContainer>
  );
};

export default DataDictionary;
