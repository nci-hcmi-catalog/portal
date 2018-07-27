import React from 'react';
import { AdminContext } from 'providers/AdminProvider';
import { AdminModelNav, NavItem } from 'theme/adminModelStyles';

export default () => (
  <AdminContext.Consumer>
    {({
      state: {
        modelUploadSingle: { activeTab },
      },
      setModelUploadSingleActiveTab,
    }) => (
      <AdminModelNav>
        <NavItem
          active={activeTab === 'edit'}
          onClick={() => setModelUploadSingleActiveTab('edit')}
        >
          Edit
        </NavItem>
        <NavItem
          active={activeTab === 'images'}
          onClick={() => setModelUploadSingleActiveTab('images')}
        >
          Images
        </NavItem>
        <NavItem
          active={activeTab === 'variants'}
          onClick={() => setModelUploadSingleActiveTab('variants')}
        >
          Variants
        </NavItem>
      </AdminModelNav>
    )}
  </AdminContext.Consumer>
);
