import React from 'react';
import { AdminContext } from 'providers/AdminProvider';
import {
  AdminModelNav,
  NavItem,
  navItemIcon,
  navItemIconActive,
  brandPrimary,
  activeNavItemIconColor,
} from 'theme/adminModelStyles';
import AdminModelEditIcon from 'icons/AdminModelEditIcon';
import AdminModelImageIcon from 'icons/AdminModelImageIcon';
import AdminModelVariantsIcon from 'icons/AdminModelVariantsIcon';

export default () => (
  <AdminContext.Consumer>
    {({
      state: {
        ModelSingle: { activeTab },
      },
      setModelSingleActiveTab,
    }) => (
      <AdminModelNav>
        <NavItem active={activeTab === 'edit'} onClick={() => setModelSingleActiveTab('edit')}>
          <AdminModelEditIcon
            fill={activeTab === 'edit' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Edit
        </NavItem>

        <NavItem active={activeTab === 'images'} onClick={() => setModelSingleActiveTab('images')}>
          <AdminModelImageIcon
            fill={activeTab === 'images' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Images
        </NavItem>

        <NavItem
          active={activeTab === 'variants'}
          onClick={() => setModelSingleActiveTab('variants')}
        >
          <AdminModelVariantsIcon
            fill={activeTab === 'variants' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Variants
        </NavItem>
      </AdminModelNav>
    )}
  </AdminContext.Consumer>
);
