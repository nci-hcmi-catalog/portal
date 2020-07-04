import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';
import { adminPillHover } from 'theme/hoverStyles';

const {
  fonts: { openSans },
  keyedPalette: {
    black,
    bombay,
    burntSienna,
    deepIron,
    elm,
    frenchGrey,
    iron,
    lightBlack,
    lightPorcelain,
    mystic,
    pelorousapprox,
    sienna,
    white,
  },
} = base;

const pillBlue = elm;
const pillBlueHighlight = pelorousapprox;
const pillDisabled = deepIron;
const pillOrange = burntSienna;
const pillGrey = bombay;

const actionsMenuHighlight = lightBlack;
const actionsMenuHover = mystic;

const pillColour = ({ secondary, disabled }) => {
  if (disabled) {
    return { base: white, hover: white };
  } else if (secondary) {
    return { base: black, hover: black };
  } else {
    return { base: white, hover: white };
  }
};

const pillBackgroundColour = ({ primary, warning, secondary, disabled, info }) => {
  if (disabled) {
    return { base: pillDisabled, hover: pillDisabled };
  } else if (primary) {
    return { base: pillBlue, hover: pillBlueHighlight };
  } else if (warning) {
    return { base: pillOrange, hover: sienna };
  } else if (secondary) {
    return { base: white, hover: lightPorcelain };
  } else if (info) {
    return { base: pillGrey, hover: frenchGrey };
  } else {
    return { base: pillBlueHighlight, hover: elm };
  }
};

const pillBorderColour = ({ primary, warning, secondary, disabled, info }) => {
  if (disabled) {
    return pillDisabled;
  } else if (primary) {
    return pillBlue;
  } else if (warning) {
    return pillOrange;
  } else if (secondary) {
    return pillGrey;
  } else if (info) {
    return pillGrey;
  } else {
    return pillBlueHighlight;
  }
};

const PillBase = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${openSans};
  text-transform: uppercase;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  text-align: center;
  text-decoration: none;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: solid 1px ${pillBorderColour};
  color: ${props => pillColour(props).base};
  background: ${props => pillBackgroundColour(props).base};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : '0')};
  margin-right: ${props => (props.marginRight ? props.marginRight : '0')};
`;

export const SmallPill = styled(PillBase)`
  font-size: 11px;
  font-weight: bold;
  border-radius: 8px;
  padding: 2px 8px;
  text-transform: capitalize;
  label: admin-pill-small;
`;

export const Pill = styled(PillBase)`
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  padding: 4px 10px;
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

  &:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;
