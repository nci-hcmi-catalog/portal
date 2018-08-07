import styled from 'react-emotion';
import { css } from 'emotion';
import base from 'theme';
import { Row } from 'theme/system';
import { Link } from 'react-router-dom';

const {
  keyedPalette: {
    porcelain,
    white,
    sienna,
    dustyGray,
    pelorousapprox,
    brandPrimary,
    iron,
    mystic,
    black,
    lightBlack,
    darkBlack,
    mineShaft,
    shuttleGray,
  },
  buttons: { pillBase },
  fonts: { openSans, libreFranklin },
} = base;

const borderColour = porcelain;

export const Table = styled('div')`
  width: 100%;
  padding: 8px;
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

export const UnpublishedModel = styled('span')`
  width: 95px;
  height: 22px;
  border-radius: 11px;
  background-color: ${dustyGray};
  ${tableStatusBase};
  label: models-status-unpublished;
`;

export const UnpublishedChangesModel = styled('span')`
  width: 149px;
  height: 22px;
  border-radius: 11px;
  background-color: ${sienna};
  ${tableStatusBase};
  label: models-status-unpublished-changes;
`;

export const PublishedModel = styled('span')`
  width: 80px;
  height: 22px;
  border-radius: 11px;
  background-color: ${pelorousapprox};
  ${tableStatusBase};
  label: models-status-published;
`;

export const ActionPill = styled(Link)`
  ${pillBase};
  text-decoration: none;
  display: inline-block;
  width: max-content;
  background-color: ${white};
  color: ${brandPrimary};
  justify-content: space-between;
  cursor: pointer;
  :active {
    background-color: ${brandPrimary};
    color: ${white};
  }
  label: model-action-pill;
`;

export const Actions = styled('div')`
  align-items: center;
  display: inline-block;
  label: model-actions;
`;

export const ActionsMenu = styled('div')`
  width: max-content;
  height: 72px;
  box-shadow: 1px 1.7px 4px 0 ${lightBlack};
  background-color: ${white};
  border: solid 1px ${iron};
  display: flex;
  flex-direction: column;
  position: absolute;
  label: actions-menu;
`;

export const ActionsMenuItem = styled('div')`
  cursor: pointer;
  padding: 5px;
  height: 28px;
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
  text-shadow: 0px 4px 8px ${darkBlack};
  label: actions-menu-item;
`;

export const ToolbarMain = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
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
  font-weight: 500;
  font-style: bold;
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
  border: solid 0.75px ${shuttleGray};
  padding-right: 3px;
  label: toolbar-control;
`;
