import React from 'react';
import Tooltip from '../ToolTip';

import { ModelSingleContext } from './ModelSingleController';
import TabGroup from 'components/layout/VerticalTabs';
import {
  navItemIcon,
  navItemActive,
  brandPrimary,
  activeNavItemIconColor,
  disabledNavItemIconColor,
} from 'theme/adminModelStyles';
import { Tab, TabContents, TabLabel, TabHeading } from 'theme/verticalTabStyles';
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
        <TabGroup width={164}>
          <Tab
            active={activeTab === 'edit'}
            onClick={() => setUIActiveTab('edit')}
            css={activeTab === 'edit' && navItemActive}
          >
            <TabContents>
              <AdminModelEditIcon
                fill={activeTab === 'edit' ? activeNavItemIconColor : brandPrimary}
                css={navItemIcon}
              />
              <TabLabel>
                <TabHeading>Edit</TabHeading>
              </TabLabel>
            </TabContents>
          </Tab>

          <Tooltip
            trigger={() => (
              <Tab
                active={activeTab === 'images'}
                disabled={!modelExists}
                onClick={() => modelExists && setUIActiveTab('images')}
                css={activeTab === 'images' && navItemActive}
              >
                <TabContents>
                  <AdminModelImageIcon
                    fill={
                      !modelExists
                        ? disabledNavItemIconColor
                        : activeTab === 'images'
                        ? activeNavItemIconColor
                        : brandPrimary
                    }
                    css={navItemIcon}
                  />
                  <TabLabel>
                    <TabHeading>Images</TabHeading>
                  </TabLabel>
                </TabContents>
              </Tab>
            )}
            disabled={modelExists}
            offsetY={-16}
          >
            Please add a name and save the model first
          </Tooltip>

          <Tooltip
            trigger={() => (
              <Tab
                active={activeTab === 'variants'}
                disabled={!modelExists}
                onClick={() => modelExists && setUIActiveTab('variants')}
                css={activeTab === 'variants' && navItemActive}
              >
                <TabContents>
                  <AdminModelVariantsIcon
                    fill={
                      !modelExists
                        ? disabledNavItemIconColor
                        : activeTab === 'variants'
                        ? activeNavItemIconColor
                        : brandPrimary
                    }
                    css={navItemIcon}
                  />
                  <TabLabel>
                    <TabHeading>Variants</TabHeading>
                  </TabLabel>
                </TabContents>
              </Tab>
            )}
            disabled={modelExists}
            offsetY={-16}
          >
            Please add a name and save the model first
          </Tooltip>
        </TabGroup>
      );
    }}
  </ModelSingleContext.Consumer>
);
