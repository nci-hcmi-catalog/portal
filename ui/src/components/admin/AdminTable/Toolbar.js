import React from 'react';
import TextInput from '@arranger/components/dist/Input';
import FilterIcon from 'icons/FilterIcon';
import Popup from 'reactjs-popup';

import {
  ActionsMenu,
  ActionsMenuItem,
  ToolbarControl,
  ToolbarMain,
  ToolbarSection,
  ToolbarText,
} from 'theme/adminTableStyles';

const ArrowIcon = ({ isOpen }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={10}
      fill="transparent"
      stroke="#979797"
      strokeWidth="0.75px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
};

export default ({
  state: { isLoading, page, pageSize, filterValue, rowCount },
  onFilterValueChange,
  type,
  onPublishClick,
  onUnpublishClick,
  onDeleteClick,
}) => {
  const [from, to] = [page * pageSize + 1, page * pageSize + pageSize];
  return (
    <ToolbarMain>
      {type === 'Models' && (
        <ToolbarSection>
          <Popup
            trigger={open => (
              <div
                css={`
                  align-items: center;
                  display: inline-flex;
                  postion: relative;
                `}
              >
                <ToolbarText>Bulk Actions :</ToolbarText>
                <ToolbarControl onClick={() => ''}>
                  --Select An Action-- {ArrowIcon({ isOpen: open })}
                </ToolbarControl>
              </div>
            )}
            position="bottom right"
            offset={0}
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{
              padding: '0px',
              border: 'none',
              borderRadius: '10px',
              width: 'max-content',
            }}
            arrow={false}
          >
            <ActionsMenu>
              <ActionsMenuItem onClick={onPublishClick}>Publish</ActionsMenuItem>
              <ActionsMenuItem onClick={onUnpublishClick}>Unpublish</ActionsMenuItem>
              <ActionsMenuItem onClick={onDeleteClick}>Delete</ActionsMenuItem>
            </ActionsMenu>
          </Popup>
        </ToolbarSection>
      )}
      <ToolbarSection>
        <TextInput
          icon={<FilterIcon height={10} width={10} css={'margin: 0 0 0 5px;'} />}
          type="text"
          placeholder="Filter"
          value={filterValue}
          onChange={({ target: { value } }) => onFilterValueChange(value)}
        />
        <ToolbarText
          css={`
            padding-left: 28px;
          `}
        >
          {!isLoading &&
            `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} ${type}`}
        </ToolbarText>
      </ToolbarSection>
    </ToolbarMain>
  );
};
