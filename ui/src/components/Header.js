import React from 'react';
import bannerPath from 'assets/hcmi-dna-banner.jpg';
import logoPath from 'assets/logo-NIH-HCMI-Catalog.svg';
import { Link } from 'react-router-dom';

export default () => (
  <Link
    to="/"
    css={`
      display: flex;
      background: #fff0ce;
      background-image: url(${bannerPath});
      height: 50px;
      background-repeat: no-repeat;
      background-position: right;
      justify-content: space-between;
      align-items: center;
      padding: 0 23px;
      text-decoration: none;
    `}
  >
    <img
      src={logoPath}
      alt="HCMI Catalog logo"
      css={`
        height: 39px;
      `}
    />
    <div
      css={`
        text-transform: uppercase;
        font-family: 'Libre Franklin';
        font-size: 18px;
        font-style: normal;
        font-stretch: normal;
        line-height: 0.87;
        letter-spacing: 0.04em;
        text-align: left;
        color: #ffffff;
        text-shadow: 0 0 4.9px rgba(50, 50, 50, 0.44);
      `}
    >
      Human Cancer Models Initiative
    </div>
  </Link>
);
