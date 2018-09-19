import styled from 'react-emotion';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

import base from 'theme';
import { Row } from 'theme/system';
import { SmallPill } from 'theme/adminControlsStyles';

const {
  keyedPalette: { white, shuttleGrey, iron, mystic, black, lightBlack, mineShaft, frenchGrey },
  fonts: { openSans, libreFranklin },
} = base;

export const Table = styled('div')`
  width: 100%;
  margin-bottom: 52px;
  align-self: center;
  background: ${white};
  label: models-table-main;
`;

const tableStatusBase = css`
  font-family: ${libreFranklin};
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.6;
  letter-spacing: 0.2px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px 10px;
  text-transform: uppercase;
  color: ${white};
`;

export const ActionPill = styled(SmallPill)`
  font-size: 12px;
  font-weight: bold;
  line-height: 26px;
  padding: 0 13px;
  label: model-table-action-pill;
`;

export const ActionLinkPill = ActionPill.withComponent(Link);

export const Actions = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  label: model-actions;
`;

export const ActionsMenu = styled('div')`
  width: 100%;
  box-shadow: 1px 1.7px 4px 0 ${lightBlack};
  border: solid 1px ${iron};
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  label: actions-menu;
`;

export const ActionsMenuItem = styled('div')`
  cursor: pointer;
  padding: 0 3px;
  line-height: 22px;
  background-color: ${white};
  :active {
    background-color: ${lightBlack};
  }
  :hover {
    background-color: ${mystic};
  }
  ${tableStatusBase};
  font-family: ${openSans};
  color: ${black};
  font-size: 13px;
  text-align: left;
  text-transform: none;
  label: actions-menu-item;

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

export const ToolbarMain = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px 20px;
  label: toolbar-main;
`;

export const ToolbarSection = styled('div')`
  align-items: center;
  padding-right: 5px;
  display: inherit;
  width: max-content;
  label: toolbar-section;
`;

export const ToolbarText = styled('span')`
  font-family: ${libreFranklin};
  font-size: 13px;
  line-height: 37px;
  font-weight: 500;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${mineShaft};
  margin-right: 9px;
  label: toolbar-text;
`;

export const ToolbarControl = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: max-content;
  font-family: ${openSans};
  min-width: 172px;
  font-size: 14px;
  line-height: 37px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${shuttleGrey};
  align-items: center;
  text-transform: none;
  background-color: ${white};
  border: solid 1px ${frenchGrey};
  border-radius: 10px;
  padding: 0 8px;
  cursor: pointer;
  label: toolbar-control;
`;
