import React from 'react';

import { useDictionary } from './DictionaryController';
import { NotificationToaster } from './../Notifications';

import { HoverPill } from 'theme/adminControlsStyles';
import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import {
  DataDictionaryH1,
  actionPill,
  cancelPill,
  disabledPill,
} from 'theme/adminDictionaryStyles';

import AdminModelPublishIcon from '../../../icons/AdminModelPublishIcon';

const DictionaryHeader = () => {
  const { isDraft, reset, publish } = useDictionary();

  return (
    <>
      <NotificationToaster />
      <AdminHeader>
        <DataDictionaryH1>Data Dictionary</DataDictionaryH1>
        <AdminHeaderBlock>
          <HoverPill
            primary
            disabled={!isDraft}
            marginRight="10px"
            css={!isDraft ? disabledPill : cancelPill}
            onClick={reset}
          >
            Reset
          </HoverPill>
          <HoverPill
            primary
            disabled={!isDraft}
            marginRight="10px"
            css={!isDraft ? disabledPill : actionPill}
            onClick={publish}
          >
            <AdminModelPublishIcon width={16} height={16} css={'margin-right: 9px;'} />
            Publish All Updates
          </HoverPill>
        </AdminHeaderBlock>
      </AdminHeader>
    </>
  );
};

export default DictionaryHeader;
