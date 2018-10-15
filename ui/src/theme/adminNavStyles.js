import { css } from 'emotion';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';
import { adminPillHover } from 'theme/hoverStyles';
import { Row } from 'theme/system';
import {whiteHover} from 'theme/hoverStyles';

const {
  fonts: { libreFranklin, openSans },
  transparency: { brandPrimary70 },
  keyedPalette: { brandPrimary, valencia, porcelain },
  buttons: { pillBase },
} = base;

const navBackgroundColour = brandPrimary70;
const navOnState = valencia;

export const AdminNav = styled(Row)`
  font-family: ${libreFranklin};
  background-color: ${navBackgroundColour};
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 6px solid white;
`;

const activeNavLink = css`
  background-color: ${navOnState};

  &::after {
    display: block;
    position: absolute;
    left: calc(50% - 7px);
    bottom: 0px;
    content: '';
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid white;
  }
`;

export const NavLink = styled(Link)`
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: center;
  line-height: 50px;
  padding: 0 22px;
  text-transform: uppercase;
  ${whiteHover};
  ${props => props.active && activeNavLink};
`;

export const Account = styled('div')`
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: center;
`;

export const Pill = styled('div')`
  ${pillBase};
  line-height: 27px;
  color: ${brandPrimary};
  margin-left: ${props => props.last && '20px'};
`;

export const HoverPill = styled(Pill)`
  ${adminPillHover({ base: brandPrimary, hover: valencia }, { base: '#ffffff', hover: porcelain })};
`;

export const User = styled(Pill)`
  font-family: ${openSans};
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: center;
  color: ${brandPrimary};
  border: none;
  padding: 1px 15px;
`;

export const AnchorTag = User.withComponent('a');
