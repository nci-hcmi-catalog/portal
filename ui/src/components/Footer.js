import React from 'react';

import { Row } from 'theme/system';
import nihPath from 'assets/logo-NIH-NCI.svg';
import sangerPath from 'assets/logo-welcome-sanger-institute.png';
import hubPath from 'assets/logo-hubrecht-organoid-technology.png';
import cancerResearchUKPath from 'assets/logo-cancer-research-uk.png';

const Footer = () => (
  <footer
    css={`
      height: 70px;
      background-color: #ffffff;
      box-shadow: 0 0 5.9px 0.1px rgba(160, 160, 163, 0.93);
      margin-top: 6px;
      color: #fff;
      font-family: 'Open Sans';
      font-size: 14px;
      display: flex;
      justify-content: center;

      a:link,
      a:visited {
        font-family: 'Open Sans';
        font-size: 14px;
        color: #fff;
        text-decoration: none;
      }

      span {
        margin-top: 10px;
      }

      .tagline {
        color: #dfd4cf;
      }
    `}
  >
    <Row alignItems="center" justifyContent="space-between" minWidth={147} width="50%">
      <img
        src={nihPath}
        alt="NIH"
        css={`
          height: 24px;
        `}
      />
      <img
        src={sangerPath}
        alt="Wellcome Sanger Institue"
        css={`
          height: 41px;
        `}
      />
      <img
        src={hubPath}
        alt="Hubrecht Organoid Technology"
        css={`
          height: 41px;
        `}
      />
      <img
        src={cancerResearchUKPath}
        alt="Cancer Research UK"
        css={`
          height: 41px;
        `}
      />
    </Row>
  </footer>
);

export default Footer;
