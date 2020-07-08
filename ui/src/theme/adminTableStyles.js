import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import base from 'theme';
import { Row } from 'theme/system';
import { SmallHoverPill } from 'theme/adminControlsStyles';

const {
  keyedPalette: { bombay, white, black, lightBlack, trout, lightPorcelain },
  fonts: { openSans },
} = base;

export const Table = styled('div')`
  width: 100%;
  margin-bottom: ${({ marginBottom }) => marginBottom || '52px'};
  align-self: center;
  background: ${white};
  label: models-table-main;
`;

export const ActionPill = styled(SmallHoverPill)`
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  padding: 1px 8px;
  color: ${black} !important;
  text-transform: uppercase;
  label: model-table-action-pill;
`;

export const ActionLinkPill = styled(ActionPill)`
  margin-right: 8px;
`.withComponent(Link);

export const Actions = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  label: model-actions;
`;

export const ActionsMenu = styled('div')`
  width: 100%;
  box-shadow: 1px 1.7px 4px 0 ${lightBlack};
  border: solid 1px ${bombay};
  display: flex;
  border-radius: 4px;
  flex-direction: column;
  label: actions-menu;
`;

export const ActionsMenuItem = styled('div')`
  cursor: pointer;
  padding: 0 3px;
  line-height: 22px;
  background-color: ${white};
  font-family: ${openSans};
  color: ${black};
  font-size: 12px;
  text-align: left;
  text-transform: none;
  label: actions-menu-item;

  &:active,
  &:hover {
    background-color: ${lightPorcelain};
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const ToolbarMain = styled(Row)`
  width: 100%;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid #d4d7dd;
  border-bottom-width: 0;
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
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  color: ${black};
  margin-right: 4px;
  label: toolbar-text;
`;

// TODO: refactor shared Select/Dropdown styles into a component
export const ToolbarControl = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: max-content;
  font-family: ${openSans};
  min-width: 172px;
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  color: ${trout};
  align-items: center;
  text-transform: none;
  background-color: ${white};
  border: solid 1px ${bombay};
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  label: toolbar-control;

  background-image: linear-gradient(
    90deg,
    transparent 0%,
    transparent calc(100% - 29px),
    ${bombay} calc(100% - 29px),
    ${bombay} calc(100% - 28px),
    transparent calc(100% - 28px),
    transparent 100%
  );
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: ${lightPorcelain};
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent calc(100% - 29px),
      ${bombay} calc(100% - 29px),
      ${bombay} calc(100% - 28px),
      transparent calc(100% - 28px),
      transparent 100%
    );
  }
`;
