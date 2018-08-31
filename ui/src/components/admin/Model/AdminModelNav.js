import React from 'react';
import { ModelSingleContext } from './ModelSingleController';
import {
  AdminModelNav,
  NavItem,
  navItemIcon,
  brandPrimary,
  activeNavItemIconColor,
} from 'theme/adminModelStyles';
import AdminModelEditIcon from 'icons/AdminModelEditIcon';
import AdminModelImageIcon from 'icons/AdminModelImageIcon';
import AdminModelVariantsIcon from 'icons/AdminModelVariantsIcon';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        ui: { activeTab },
      },
      setUIActiveTab,
    }) => (
      <AdminModelNav>
        <NavItem active={activeTab === 'edit'} onClick={() => setUIActiveTab('edit')}>
          <AdminModelEditIcon
            fill={activeTab === 'edit' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Edit
        </NavItem>

        <NavItem active={activeTab === 'images'} onClick={() => setUIActiveTab('images')}>
          <AdminModelImageIcon
            fill={activeTab === 'images' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Images
        </NavItem>

        <NavItem active={activeTab === 'variants'} onClick={() => setUIActiveTab('variants')}>
          <AdminModelVariantsIcon
            fill={activeTab === 'variants' ? activeNavItemIconColor : brandPrimary}
            css={navItemIcon}
          />Variants
        </NavItem>
      </AdminModelNav>
    )}
  </ModelSingleContext.Consumer>
);
