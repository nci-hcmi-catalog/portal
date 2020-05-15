import React from 'react';

import { useDictionary } from './DictionaryController';
import { NotificationToaster } from './../Notifications';
import useConfirmationModal from './../../modals/ConfirmationModal';

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
          {useConfirmationModal({
            title: 'Are you sure you want to reset?',
            message:
              'Your updates will be lost and this section will revert back to the last published data dictionary if you decide to continue.',
            confirmLabel: 'Yes, Reset',
            onConfirm: reset,
          })(
            <HoverPill
              primary
              disabled={!isDraft}
              marginRight="10px"
              css={!isDraft ? disabledPill : cancelPill}
            >
              Reset
            </HoverPill>,
          )}
          {useConfirmationModal({
            title: 'Are you sure you want to publish dictionary updates?',
            message:
              'These updates will be applied to all applicable models in any state, including published models.',
            confirmLabel: 'Yes, Publish All Updates',
            onConfirm: publish,
          })(
            <HoverPill
              primary
              disabled={!isDraft}
              marginRight="10px"
              css={!isDraft ? disabledPill : actionPill}
            >
              <AdminModelPublishIcon width={16} height={16} css={'margin-right: 9px;'} />
              Publish All Updates
            </HoverPill>,
          )}
        </AdminHeaderBlock>
      </AdminHeader>
    </>
  );
};

export default DictionaryHeader;
