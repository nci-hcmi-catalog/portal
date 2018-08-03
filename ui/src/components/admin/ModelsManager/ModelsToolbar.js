import React from 'react';
import { Row } from 'theme/system';
import TextInput from '@arranger/components/dist/Input';
import FilterIcon from 'icons/FilterIcon';
import { ModelsTableContext } from './ModelsTableController';
import Popup from 'reactjs-popup';
import { ActionPill, Actions, ActionsMenu, ActionsMenuItem } from '../../../theme/adminTableStyles';
import { AdminContainer, AdminHeader, AdminContent } from 'theme/adminStyles';
import { ControlPill, Controls } from 'theme/AdminControlsStlyes';

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
        <>
          {' '}
          <AdminHeader
            css={`
              padding: 0;
            `}
          >
            {' '}
            <div
              css={`
                align-items: center;
                padding-right: 5px;
                display: 'inherit';
                width: 100%;
              `}
            >
              {' '}
              <Popup
                trigger={open => (
                  <div>
                    <strong
                      css={`
                        width: 79px;
                        height: 11px;
                        font-family: LibreFranklin;
                        font-size: 13px;
                        font-weight: 500;
                        font-style: normal;
                        font-stretch: normal;
                        line-height: 1.54;
                        letter-spacing: normal;
                        text-align: left;
                        color: #323232;
                        marginleft: 32px;
                      `}
                    >
                      Bulk Actions:
                    </strong>{' '}
                    <ActionPill
                      css={`
                        width: max-content;
                        font-family: OpenSans;
                        font-size: 13px;
                        font-weight: normal;
                        font-style: normal;
                        font-stretch: normal;
                        line-height: 2;
                        letter-spacing: normal;
                        text-align: left;
                        color: #64666a;
                        alignitems: center;
                        align-items: center;
                      `}
                      onClick={() => console.log('Bulk Actions clicked')}
                    >
                      --Select An Action-- {ArrowIcon({ isOpen: open })}
                    </ActionPill>
                  </div>
                )}
                position="bottom left"
                offset={0}
                on="click"
                closeOnDocumentClick
                mouseLeaveDelay={300}
                mouseEnterDelay={0}
                contentStyle={{
                  padding: '0px',
                  border: 'none',
                  width: 'max-content',
                }}
                arrow={false}
              >
                {' '}
                <ActionsMenu
                  css={`
                    width: 175px;
                  `}
                >
                  {' '}
                  <ActionsMenuItem> Publish All </ActionsMenuItem>{' '}
                  <ActionsMenuItem>Delete All</ActionsMenuItem>{' '}
                </ActionsMenu>{' '}
              </Popup>{' '}
            </div>{' '}
            <Controls>
              {' '}
              <TextInput
                icon={<FilterIcon height={10} width={10} fill={'#704A2C'} />}
                type="text"
                placeholder="Filter"
                value={filterValue}
                css={`
                  display: 'inherit';
                  width: max-content;
                  paddingleft: 28px;
                `}
                onChange={({ target: { value } }) => onFilterValueChange(value)}
              />{' '}
              <div
                css={`
                  display: 'inherit';
                  width: max-content;
                  font-family: OpenSans;
                  font-size: 13px;
                  font-weight: normal;
                  font-style: normal;
                  font-stretch: normal;
                  line-height: 2;
                  letter-spacing: normal;
                  text-align: left;
                  color: #64666a;
                  padding: 6px 6px 10px 10px;
                `}
              >
                {' '}
                {!isLoading &&
                  `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} Models`}{' '}
              </div>{' '}
            </Controls>{' '}
          </AdminHeader>{' '}
        </>
      );
    }}
  </ModelsTableContext.Consumer>
);
