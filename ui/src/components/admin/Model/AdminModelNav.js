import React from 'react';
import Tooltip from '../ToolTip';

import { ModelSingleContext } from './ModelSingleController';
import {
  AdminModelNav,
  NavItem,
  navItemIcon,
  brandPrimary,
  activeNavItemIconColor,
  disabledNavItemIconColor,
} from 'theme/adminModelStyles';
import AdminModelEditIcon from 'icons/AdminModelEditIcon';
import AdminModelImageIcon from 'icons/AdminModelImageIcon';
import AdminModelVariantsIcon from 'icons/AdminModelVariantsIcon';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        ui: { activeTab },
        data: { response },
      },
      setUIActiveTab,
    }) => {
      const modelExists = response.name || false;

      return (
        <AdminModelNav>
          <NavItem active={activeTab === 'edit'} onClick={() => setUIActiveTab('edit')}>
            <AdminModelEditIcon
              fill={activeTab === 'edit' ? activeNavItemIconColor : brandPrimary}
              css={navItemIcon}
            />Edit
          </NavItem>

          <Tooltip
            trigger={() => (
              <NavItem
                active={activeTab === 'images'}
                disabled={!modelExists}
                onClick={() => modelExists && setUIActiveTab('images')}
              >
                <AdminModelImageIcon
                  fill={
                    !modelExists
                      ? disabledNavItemIconColor
                      : activeTab === 'images'
                        ? activeNavItemIconColor
                        : brandPrimary
                  }
                  css={navItemIcon}
                />Images
              </NavItem>
            )}
            disabled={modelExists}
            offsetY={-16}
          >
            Please add a name and save the model first
          </Tooltip>

          <Tooltip
            trigger={() => (
              <NavItem
                active={activeTab === 'variants'}
                disabled={!modelExists}
                onClick={() => modelExists && setUIActiveTab('variants')}
              >
                <AdminModelVariantsIcon
                  fill={
                    !modelExists
                      ? disabledNavItemIconColor
                      : activeTab === 'variants'
                        ? activeNavItemIconColor
                        : brandPrimary
                  }
                  css={navItemIcon}
                />Variants
              </NavItem>
            )}
            disabled={modelExists}
            offsetY={-16}
          >
            Please add a name and save the model first
          </Tooltip>
        </AdminModelNav>
      );
    }}
  </ModelSingleContext.Consumer>
);
