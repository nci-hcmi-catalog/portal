import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';
import { adminPillHover } from 'theme/hoverStyles';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    brandPrimary,
    burntSienna,
    pelorousapprox,
    valencia,
    sienna,
    white,
    frenchGrey,
    lightBlack,
    iron,
    mystic,
    black,
    dustyGray,
    lightPorcelain,
  },
} = base;

const pillBlue = pelorousapprox;
const pillRed = valencia;
const pillBlueDisabled = '#AADBE3';
const pillRedDisabled = '#E8AFB2';
const pillOrange = sienna;
const pillGrey = dustyGray;
const pillBorderColour = frenchGrey;

const actionsMenuHighlight = lightBlack;
const actionsMenuHover = mystic;

const pillColour = ({ secondary, disabled }) => {
  if (secondary && disabled) {
    return { base: brandPrimary, hover: brandPrimary };
  } else if (secondary) {
    return { base: brandPrimary, hover: valencia };
  } else {
    return { base: white, hover: white };
  }
};

const pillBackgroundColour = ({ primary, warning, secondary, disabled, info }) => {
  if (primary && disabled) {
    return { base: pillRedDisabled, hover: pillRedDisabled };
  } else if (primary) {
    return { base: pillRed, hover: burntSienna };
  } else if (warning && disabled) {
    return { base: pillOrange, hover: sienna };
  } else if (warning) {
    return { base: pillOrange, hover: '#D9805A' };
  } else if (secondary && disabled) {
    return { base: white, hover: white };
  } else if (secondary) {
    return { base: white, hover: lightPorcelain };
  } else if (info) {
    return { base: pillGrey, hover: '#A2A2A2' };
  } else if (disabled) {
    return { base: pillBlueDisabled, hover: pillBlueDisabled };
  } else {
    return { base: pillBlue, hover: '#58BAC9' };
  }
};

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
  text-decoration: none;
  opacity: ${({ secondary, disabled }) => (secondary && disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: solid 1px ${pillBorderColour};
  color: ${props => pillColour(props).base};
  background: ${props => pillBackgroundColour(props).base};
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

export const SmallHoverPill = styled(SmallPill)`
  ${props => adminPillHover(pillColour(props), pillBackgroundColour(props))};
`;

export const HoverPill = styled(Pill)`
  ${props => adminPillHover(pillColour(props), pillBackgroundColour(props))};
`;

export const SmallLinkPill = SmallHoverPill.withComponent(Link);

export const LinkPill = HoverPill.withComponent(Link);

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

  &:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;
