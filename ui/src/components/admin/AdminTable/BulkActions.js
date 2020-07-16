import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import withDeleteModal from '../DeleteModal';

import {
  ActionsMenu,
  ActionsMenuItem,
  ToolbarControl,
  ToolbarSection,
  ToolbarText,
} from 'theme/adminTableStyles';

import { ButtonPill } from 'theme/adminControlsStyles';
const [publishAction, unpublishAction, deleteAction] = ['Publish', 'Unpublish', 'Delete'];

const onApplyClick = ({ action, onPublishClick, onUnpublishClick, reset }) => {
  reset();
  switch (action) {
    case publishAction:
      return onPublishClick();
    case unpublishAction:
      return onUnpublishClick();
    default:
      return false;
  }
};

export default ({ onPublishClick, onUnpublishClick, onDeleteClick, hasSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  return (
    <ToolbarSection>
      <Popup
        trigger={() => (
          <div
            css={`
              align-items: center;
              display: inline-flex;
              postion: relative;
            `}
          >
            <ToolbarText>Bulk Actions:</ToolbarText>
            <ToolbarControl onClick={() => setIsOpen(!isOpen)}>
              <span>{selectedAction ? `-- ${selectedAction} --` : '-- Select An Action --'}</span>
              {CollapsibleArrow({ isOpen })}
            </ToolbarControl>
          </div>
        )}
        position="bottom right"
        offset={0}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        contentStyle={{
          padding: '0px',
          border: 'none',
          borderRadius: '4px',
          width: 'max-content',
          minWidth: '172px',
        }}
        arrow={false}
      >
        <ActionsMenu>
          <ActionsMenuItem
            onClick={() => {
              setIsOpen(false);
              setSelectedAction(publishAction);
            }}
          >
            {publishAction}
          </ActionsMenuItem>
          <ActionsMenuItem
            onClick={() => {
              setIsOpen(false);
              setSelectedAction(unpublishAction);
            }}
          >
            {unpublishAction}
          </ActionsMenuItem>
          <ActionsMenuItem
            onClick={() => {
              setIsOpen(false);
              setSelectedAction(deleteAction);
            }}
          >
            {deleteAction}
          </ActionsMenuItem>
        </ActionsMenu>
      </Popup>
      {selectedAction === deleteAction ? (
        withDeleteModal({
          next: () => {
            if (!hasSelection) {
              return;
            }
            setIsOpen(false);
            setSelectedAction('');
            onDeleteClick();
          },
          target: 'multiple models',
          onCancel: () => {
            setIsOpen(false);
            setSelectedAction('');
          },
        })(
          <ButtonPill
            secondary
            marginLeft="8px"
            disabled={!hasSelection || selectedAction.length === 0}
          >
            Apply
          </ButtonPill>,
        )
      ) : (
        <ButtonPill
          secondary
          onClick={() =>
            hasSelection &&
            onApplyClick({
              action: selectedAction,
              onPublishClick,
              onUnpublishClick,
              reset: () => {
                setIsOpen(false);
                setSelectedAction('');
              },
            })
          }
          marginLeft="8px"
          disabled={!hasSelection || selectedAction.length === 0}
        >
          Apply
        </ButtonPill>
      )}
    </ToolbarSection>
  );
};
