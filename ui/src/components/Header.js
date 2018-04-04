import React from 'react';
import bannerPath from 'assets/hcmi-dna-banner.jpg';
import logoPath from 'assets/logo-NIH-HCMI-Catalog.svg';
import { Row } from 'components/Layout';

export default () => (
  <Row
    css={`
      background: #fff0ce;
      background-image: url(${bannerPath});
      height: 88px;
      background-repeat: no-repeat;
      background-position: right;
      justify-content: space-between;
      align-items: center;
      padding: 0 23px;
    `}
  >
    <img
      src={logoPath}
      alt="HCMI Catalog logo"
      css={`
        height: 51px;
      `}
    />
    <div
      css={`
        font-family: 'Libre Franklin';
        font-size: 30px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: left;
        color: #ffffff;
        text-shadow: 0 0 4.9px rgba(50, 50, 50, 0.44);
      `}
    >
      Human Cancer Models Initiative
    </div>
  </Row>
);
