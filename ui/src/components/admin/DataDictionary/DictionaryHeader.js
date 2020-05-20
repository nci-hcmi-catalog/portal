import React from 'react';

import { useDictionary } from './DictionaryController';
import { NotificationToaster } from './../Notifications';
import useConfirmationModal from './../../modals/ConfirmationModal';

import { HoverPill } from 'theme/adminControlsStyles';
import { AdminHeaderBlock } from 'theme/adminStyles';
import {
  DataDictionaryHeader,
  DataDictionaryH1,
  DictionaryDraftTimestamp,
  DictionaryDraftStats,
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
      <DataDictionaryHeader>
        <AdminHeaderBlock>
          <DictionaryDraftTimestamp>
            Last published: {lastPublished}
            {isDraft && (
              <>
                <span>|</span>
                Last updated: {lastUpdated}
              </>
            )}
          </DictionaryDraftTimestamp>
          <DataDictionaryH1>Data Dictionary</DataDictionaryH1>
          {isDraft && (
            <>
              <HeaderPill>Draft</HeaderPill>
              <DictionaryDraftStats>
                {totalEdits} edited value{totalEdits !== 1 ? 's' : ''}
                <span>|</span>
                {totalNew} new value{totalNew !== 1 ? 's' : ''}
              </DictionaryDraftStats>
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
              'These updates will be applied to all applicable models in any state. Any published models that have been affected will switch to "Changes not yet published". You can republish them in the model management section.',
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
      </DataDictionaryHeader>
    </>
  );
};

export default DictionaryHeader;
