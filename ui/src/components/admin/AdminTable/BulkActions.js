import React from 'react';
import Component from 'react-component-component';
import Popup from 'reactjs-popup';

import withDeleteModal from '../DeleteModal';

import {
  ActionsMenu,
  ActionsMenuItem,
  ToolbarControl,
  ToolbarSection,
  ToolbarText,
} from 'theme/adminTableStyles';

import { Pill } from 'theme/adminControlsStyles';

const ArrowIcon = ({ isOpen }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={10}
      fill="transparent"
      stroke="#64666a"
      strokeWidth="2px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
};

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

export default ({ onPublishClick, onUnpublishClick, onDeleteClick, hasSelection }) => (
  <Component
    initialState={{
      isOpen: false,
      selectedAction: '',
    }}
  >
    {({ setState, state: { isOpen, selectedAction } }) => (
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
              <ToolbarText>Bulk Actions :</ToolbarText>
              <ToolbarControl onClick={() => setState({ isOpen: !isOpen })}>
                <span>{selectedAction ? `-- ${selectedAction} --` : '-- Select An Action --'}</span>
                {ArrowIcon({ isOpen })}
              </ToolbarControl>
            </div>
          )}
          position="bottom right"
          offset={0}
          open={isOpen}
          contentStyle={{
            padding: '0px',
            border: 'none',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            width: 'max-content',
            minWidth: '172px',
          }}
          arrow={false}
        >
          <ActionsMenu>
            <ActionsMenuItem
              onClick={() => setState({ isOpen: false, selectedAction: publishAction })}
            >
              {publishAction}
            </ActionsMenuItem>
            <ActionsMenuItem
              onClick={() => setState({ isOpen: false, selectedAction: unpublishAction })}
            >
              {unpublishAction}
            </ActionsMenuItem>
            <ActionsMenuItem
              onClick={() => setState({ isOpen: false, selectedAction: deleteAction })}
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
              setState({ isOpen: false, selectedAction: '' });
              onDeleteClick();
            },
            target: 'multiple models',
            onCancel: () => setState({ isOpen: false, selectedAction: '' }),
          })(
            <Pill
              marginLeft="8px"
              secondary
              disabled={!hasSelection || selectedAction.length === 0}
            >
              Apply
            </Pill>,
          )
        ) : (
          <Pill
            onClick={() =>
              hasSelection &&
              onApplyClick({
                action: selectedAction,
                onPublishClick,
                onUnpublishClick,
                reset: () => setState({ isOpen: false, selectedAction: '' }),
              })
            }
            marginLeft="8px"
            secondary
            disabled={!hasSelection || selectedAction.length === 0}
          >
            Apply
          </Pill>
        )}
      </ToolbarSection>
    )}
  </Component>
);
