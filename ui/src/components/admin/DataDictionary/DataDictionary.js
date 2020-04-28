import React, { useState } from 'react';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { NotificationToaster } from '../Notifications';

import AdminModelPublishIcon from '../../../icons/AdminModelPublishIcon';
import AdminModelSaveIcon from '../../../icons/AdminModelSaveIcon';

import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';
import { HoverPill } from 'theme/adminControlsStyles';
import {
  AdminDictionaryContent,
  FieldValues,
  DependentValues,
  DictionaryColumnHeading,
  disabledPill,
  cancelPill,
  actionPill,
} from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

const DataDictionary = () => {
  // temporary use of state, will be using context for this eventually
  const [activeTab, setActiveTab] = useState('tab-0');
  const groupName = 'Editable Fields';
  // temporary toggle for header buttons
  const disableHeaderButtons = true;

  return (
    <AdminContainer>
      <NotificationToaster />
      <AdminHeader>
        <AdminHeaderH1>Data Dictionary</AdminHeaderH1>
        <AdminHeaderBlock>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : cancelPill}
            onClick={() => console.log('Data Dictionary: Cancel')}
          >
            Cancel
          </HoverPill>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : actionPill}
            onClick={() => console.log('Data Dictionary: Publish All Updates')}
          >
            <AdminModelPublishIcon width={16} height={16} css={'margin-right: 9px;'} />
            Publish All Updates
          </HoverPill>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : actionPill}
            onClick={() => console.log('Data Dictionary: Save Draft')}
          >
            <AdminModelSaveIcon width={16} height={16} css={'margin-right: 9px;'} />
            Save Draft
          </HoverPill>
        </AdminHeaderBlock>
      </AdminHeader>
      <Row>
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
        <AdminDictionaryContent>
          <FieldValues>
            <DictionaryColumnHeading>Field Values</DictionaryColumnHeading>
            <Row>
              <form>
                <input type="text" id="new-field" name="new-field" placeholder="Add a new value..." />
                <button>Add</button>
              </form>
            </Row>
            <ol>
              <li>Value 1</li>
              <li>Value 2</li>
              <li>Value 3</li>
              <li>Value 4</li>
            </ol>
          </FieldValues>
          {/* <DependentValues>
            <DictionaryColumnHeading>Dependent Field Values</DictionaryColumnHeading>
          </DependentValues> */}
        </AdminDictionaryContent>
      </Row>
    </AdminContainer>
  );
};

export default DataDictionary;
