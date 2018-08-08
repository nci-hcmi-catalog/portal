import React from 'react';
import TextInput from '@arranger/components/dist/Input';
import FilterIcon from 'icons/FilterIcon';
import { ModelsTableContext } from './ModelsTableController';
import Popup from 'reactjs-popup';
import {
  ActionsMenu,
  ActionsMenuItem,
  ToolbarMain,
  ToolbarSection,
  ToolbarText,
  ToolbarControl,
} from '../../../theme/adminTableStyles';

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

export default props => (
  <ModelsTableContext.Consumer>
    {({ state: { isLoading, page, pageSize, filterValue, rowCount }, onFilterValueChange }) => {
      const [from, to] = [page * pageSize + 1, page * pageSize + pageSize];
      return (
        <ToolbarMain>
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
                  <ToolbarText>Bulk Actions :</ToolbarText>{' '}
                  <ToolbarControl onClick={() => console.log('Bulk Actions clicked')}>
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
                <ActionsMenuItem>Publish</ActionsMenuItem>
                <ActionsMenuItem>Unpublish</ActionsMenuItem>
                <ActionsMenuItem>Delete</ActionsMenuItem>
              </ActionsMenu>
            </Popup>
          </ToolbarSection>
          <ToolbarSection>
            <TextInput
              icon={<FilterIcon height={10} width={10} fill={'#704A2C'} />}
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
                `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} Models`}{' '}
            </ToolbarText>
          </ToolbarSection>
        </ToolbarMain>
      );
    }}
  </ModelsTableContext.Consumer>
);
