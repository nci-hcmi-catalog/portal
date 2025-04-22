import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import base from 'theme';
import { adminPillHover } from 'theme/hoverStyles';

const {
  fonts: { openSans },
  keyedPalette: {
    black,
    bombay,
    deepIron,
    elm,
    frenchGrey,
    goldenGlow,
    iron,
    lightBlack,
    lightPorcelain,
    mystic,
    pelorousapprox,
    sienna,
    tiaMaria,
    texasRose,
    trout,
    white,
  },
} = base;

const pillBlue = elm;
const pillBlueHighlight = pelorousapprox;
const pillPrimary = texasRose;
const pillPrimaryHighlight = goldenGlow;
const pillDisabled = deepIron;
const pillOrange = tiaMaria;
const pillGrey = trout;
const pillGreyHighlight = bombay;

const actionsMenuHighlight = lightBlack;
const actionsMenuHover = mystic;

const pillColour = ({ primary, secondary, disabled }) => {
  switch (true) {
    case !!disabled:
      return { base: white, hover: white };
    case !!secondary:
      return { base: black, hover: black };
    case !!primary:
      return { base: black, hover: black };
    default:
      return { base: white, hover: white };
  }
};

const pillBackgroundColour = ({ primary, warning, secondary, disabled, info }) => {
  switch (true) {
    case !!disabled:
      return { base: pillDisabled, hover: pillDisabled };
    case !!primary:
      return { base: pillPrimary, hover: pillPrimaryHighlight };
    case !!warning:
      return { base: pillOrange, hover: sienna };
    case !!secondary:
      return { base: white, hover: lightPorcelain };
    case !!info:
      return { base: pillGrey, hover: frenchGrey };
    default:
      return { base: pillBlue, hover: pillBlueHighlight };
  }
};

const pillBorderColour = ({ primary, warning, secondary, disabled, info }) => {
  switch (true) {
    case !!disabled:
      return pillDisabled;
    case !!primary:
      return pillPrimary;
    case !!warning:
      return pillOrange;
    case !!secondary:
      return pillGreyHighlight;
    case !!info:
      return pillGrey;
    default:
      return pillBlue;
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
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 8px;
  text-transform: uppercase;
  cursor: default;
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
  cursor: pointer;
`;

export const HoverPill = styled(Pill)`
  ${props => adminPillHover(pillColour(props), pillBackgroundColour(props))};
`;

export const SmallLinkPill = SmallHoverPill.withComponent(Link);

export const SmallButtonPill = SmallHoverPill.withComponent('button');

export const LinkPill = HoverPill.withComponent(Link);

export const ButtonPill = HoverPill.withComponent('button');

export const ExternalLinkPill = HoverPill.withComponent('a');

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
