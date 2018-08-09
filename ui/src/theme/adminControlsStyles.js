import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary, pelorousapprox, valencia, sienna, white, frenchGrey },
} = base;

const pillBlue = pelorousapprox;
const pillRed = valencia;
const pillBlueDisabled = '#AADBE3';
const pillRedDisabled = '#E8AFB2';
const pillOrange = sienna;
const pillBorderColour = frenchGrey;

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
  border-radius: 11px;
  padding: 0 12px;
  label: admin-pill-small;
`;

export const Pill = styled(PillBase)`
  font-size: 12px;
  font-weight: 500;
  line-height: 35px;
  border-radius: 10px;
  padding: 0 18px;
  label: admin-pill;
`;

export const LinkPill = Pill.withComponent(Link);
