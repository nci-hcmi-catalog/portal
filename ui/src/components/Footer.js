import React from 'react';

import base from 'theme';
import { Row } from 'theme/system';
import nihPath from 'assets/logo-NIH-NCI.svg';
import sangerPath from 'assets/logo-wellcome-sanger-institute.svg';
import hubPath from 'assets/logo-hub.svg';
import cancerResearchUKPath from 'assets/logo-cancer-research-UK.svg';

const {
  keyedPalette: { ironApprox },
} = base;

const Footer = () => (
  <footer
    css={`
      height: 56px;
      background-color: #ffffff;
      border-top: 1px solid ${ironApprox};
      display: flex;
      justify-content: center;
    `}
  >
    <Row alignItems="center" justifyContent="space-between" minWidth={147} width="80%">
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
