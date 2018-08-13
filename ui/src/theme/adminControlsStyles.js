import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    brandPrimary,
    pelorousapprox,
    valencia,
    sienna,
    white,
    frenchGrey,
    lightBlack,
    iron,
    mystic,
    black,
  },
} = base;

const pillBlue = pelorousapprox;
const pillRed = valencia;
const pillBlueDisabled = '#AADBE3';
const pillRedDisabled = '#E8AFB2';
const pillOrange = sienna;
const pillBorderColour = frenchGrey;

const actionsMenuHighlight = lightBlack;
const actionsMenuHover = mystic;

const PillBase = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${libreFranklin};
  text-transform: uppercase;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: ${({ secondary }) => (secondary ? brandPrimary : white)};
  border: solid 1px ${pillBorderColour};
  background: ${({ primary, warning, secondary, disabled }) => {
    if (primary && disabled) {
      return pillRedDisabled;
    } else if (primary) {
      return pillRed;
    } else if (warning && disabled) {
      return pillOrange;
    } else if (warning) {
      return pillOrange;
    } else if (secondary && disabled) {
      return white;
    } else if (secondary) {
      return white;
    } else if (disabled) {
      return pillBlueDisabled;
    } else {
      return pillBlue;
    }
  }};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : '0')};
  margin-right: ${props => (props.marginRight ? props.marginRight : '0')};
`;

export const SmallPill = styled(PillBase)`
  font-size: 10px;
  line-height: 22px;
  min-height: 24px;
  border-radius: 11px;
  padding: 0 12px;
  label: admin-pill-small;
`;

export const Pill = styled(PillBase)`
  font-size: 12px;
  font-weight: 500;
  line-height: 35px;
  min-height: 37px;
  border-radius: 10px;
  padding: 0 18px;
  label: admin-pill;
`;

export const LinkPill = Pill.withComponent(Link);

export const ActionsMenu = styled('div')`
  display: flex;
  flex-direction: column;
  border: solid 1px ${iron};
  border-radius: 10px;
  box-shadow: 1px 1.7px 4px 0 ${actionsMenuHighlight};
  label: actions-menu;
`;

export const ActionsMenuItem = styled('div')`
  cursor: pointer;
  line-height: 22px;
  min-height: 22px;
  padding: 0 20px;
  border-radius: 10px;
  background-color: ${white};
  font-family: ${openSans};
  color: ${black};
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.31;
  letter-spacing: normal;
  text-align: left;
  label: actions-menu-item;

  :active {
    background-color: ${actionsMenuHighlight};
  }

  :hover {
    background-color: ${actionsMenuHover};
  }
`;
