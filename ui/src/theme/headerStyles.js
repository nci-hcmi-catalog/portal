import { css } from 'emotion';
import styled from 'react-emotion';

import { Link } from 'react-router-dom';

import bannerPath from 'assets/hcmi-catalog-banner.jpg';
import base from 'theme';

const {
  fonts: { openSans },
  keyedPalette: { hotCinnamon, orangeRough, texasRose, white, lightBlack },
} = base;

export const HEADER_HEIGHT = '64px';

export const Header = styled('header')`
  display: flex;
  background-image: url(${bannerPath}),
    linear-gradient(to left, ${hotCinnamon} 0%, ${texasRose} 60%, ${orangeRough} 80%);
  height: ${HEADER_HEIGHT};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 16px 12px 13px;
`;

export const HeaderLink = styled(Link)`
  font-family: ${openSans};
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  color: ${white};
  text-decoration: none;
  text-shadow: 1px 1px 2px ${lightBlack};
`;

export const subheadingStyle = css`
  font-family: ${openSans};
  font-size: 26px;
  font-weight: bold;
  line-height: normal;
  color: ${white};
  text-shadow: 1px 1px 2px ${lightBlack};
`;
