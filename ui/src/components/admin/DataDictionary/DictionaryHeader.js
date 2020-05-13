import React from 'react';

import { useDictionary } from './DictionaryController';
import { NotificationToaster } from './../Notifications';

import { HoverPill } from 'theme/adminControlsStyles';
import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import {
  DataDictionaryH1,
  DictionaryDraftPublished,
  DictionaryDraftUpdated,
  HeaderPill,
  actionPill,
  cancelPill,
  disabledPill,
} from 'theme/adminDictionaryStyles';

import AdminModelPublishIcon from '../../../icons/AdminModelPublishIcon';

const DictionaryHeader = () => {
  const {
    isDraft,
    lastPublished,
    lastUpdated,
    publish,
    reset,
    totalEdits,
    totalNew,
  } = useDictionary();

  return (
    <>
      <NotificationToaster />
      <AdminHeader>
        <AdminHeaderBlock>
          <DictionaryDraftPublished>Last published: {lastPublished}</DictionaryDraftPublished>
          <DataDictionaryH1>Data Dictionary</DataDictionaryH1>
          {isDraft && (
            <>
              <HeaderPill>Draft</HeaderPill>
              <DictionaryDraftUpdated>
                Last updated: {lastUpdated}
                <span>|</span>
                {totalEdits} edited value{totalEdits !== 1 ? 's' : ''}
                <span>|</span>
                {totalNew} new value{totalNew !== 1 ? 's' : ''}
              </DictionaryDraftUpdated>
            </>
          )}
        </AdminHeaderBlock>
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
