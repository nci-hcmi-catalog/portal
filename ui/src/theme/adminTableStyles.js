import styled from 'react-emotion';
import { css } from 'emotion';

import base from 'theme';
import { Row } from 'theme/system';
import { SmallLinkPill } from 'theme/adminControlsStyles';

const {
  keyedPalette: {
    porcelain,
    white,
    dustyGray,
    iron,
    mystic,
    black,
    lightBlack,
    mineShaft,
    shuttleGray,
  },
  fonts: { openSans, libreFranklin },
} = base;

const borderColour = porcelain;

export const Table = styled('div')`
  width: 100%;
  padding: 8px;
  margin-bottom: 52px;
  align-self: center;
  background: ${white};
  border: solid 1px ${borderColour};
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

export const ActionPill = styled(SmallLinkPill)`
  font-size: 12px;
  font-weight: bold;
  line-height: 26px;
  padding: 0 13px;
  label: model-table-action-pill;
`;

export const Actions = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  label: model-actions;
`;

export const ActionsMenu = styled('div')`
  width: 125px;
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
  padding: 12px 22px 20px;
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
  display: inherit;
  width: max-content;
  font-family: ${libreFranklin};
  font-size: 13px;
  font-stretch: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: left;
  color: ${mineShaft};
  padding-left: 5px;
  padding-right: 5px;
  label: toolbar-text;
`;

export const ToolbarControl = styled('div')`
  display: inline-block;
  width: max-content;
  font-family: ${openSans};
  font-family: OpenSans;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: ${dustyGray};
  align-items: center;
  text-transform: none;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${white};
  border: solid 1px ${shuttleGray};
  padding-right: 3px;
  label: toolbar-control;
`;
