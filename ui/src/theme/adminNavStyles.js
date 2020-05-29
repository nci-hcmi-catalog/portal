import { css } from 'emotion';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import base from 'theme';
import { adminPillHover } from 'theme/hoverStyles';
import { Row } from 'theme/system';
import { whiteHover } from 'theme/hoverStyles';

const {
  fonts: { openSans },
  transparency: { brandPrimary70 },
  keyedPalette: { athensGray, black, bombay, brandPrimary, valencia, porcelain },
  buttons: { pillBase },
} = base;

const navBackgroundColour = brandPrimary70;
const navOnState = valencia;

export const AdminNav = styled(Row)`
  font-family: ${openSans};
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
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: center;
  line-height: 50px;
  padding: 0 22px;
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

export const UserDropdown = styled(HoverPill)`
  font-family: ${openSans};
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: center;
  color: ${black};
  border: 1px solid ${bombay};
  border-radius: 10px;
  height: 28px;
  display: flex;
  align-items: center;
  background-color: ${props => props.isOpen && athensGray};

  &:hover {
    color: ${black};
  }
`;

export const DropdownItem = styled('a')`
  text-align: left;
  font-family: ${openSans};
  padding: 5px 9px;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.71;
  color: ${black};
  display: block;
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    background-color: ${porcelain};
  }
`;
