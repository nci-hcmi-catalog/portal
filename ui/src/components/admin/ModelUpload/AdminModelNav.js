import React from 'react';
import { AdminContext } from 'providers/AdminProvider';
import { AdminModelNav, NavItem } from 'theme/adminModelStyles';

export default () => (
  <AdminContext.Consumer>
    {({
      state: {
        ModelSingle: { activeTab },
      },
      setModelSingleActiveTab,
    }) => (
      <AdminModelNav>
        <NavItem
          active={activeTab === 'edit'}
          onClick={() => setModelSingleActiveTab('edit')}
        >
          Edit
        </NavItem>
        <NavItem
          active={activeTab === 'images'}
          onClick={() => setModelSingleActiveTab('images')}
        >
          Images
        </NavItem>
        <NavItem
          active={activeTab === 'variants'}
          onClick={() => setModelSingleActiveTab('variants')}
        >
          Variants
        </NavItem>
      </AdminModelNav>
    )}
  </AdminContext.Consumer>
);
