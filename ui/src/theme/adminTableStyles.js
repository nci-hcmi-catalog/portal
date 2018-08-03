import styled from 'react-emotion';
import { css } from 'emotion';
import base from 'theme';
const {
  keyedPalette: { porcelain, white, sienna, dustyGray, pelorousapprox, brandPrimary },
  buttons: { pillBase },
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
  font-family: LibreFranklin;
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
  ${tableStatusBase} label: models-status-unpublished;
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

export const ActionPill = styled('span')`
  ${pillBase};
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
