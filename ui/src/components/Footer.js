import React from 'react';

import {
  Footer,
  FooterNav,
  FooterNavItem,
  FooterImg,
  CopyrightText,
  CopyrightLink,
} from 'theme/searchStyles';
import { Col, Row } from 'theme/system';
import nihPath from 'assets/logo-NIH-NCI.svg';
import sangerPath from 'assets/logo-wellcome-sanger-institute.svg';
import hubPath from 'assets/logo-hub.svg';
import cancerResearchUKPath from 'assets/logo-cancer-research-UK.svg';

export default () => (
  <Footer>
    <Col>
      <Row alignItems="center">
        <CopyrightText>
          &copy; {new Date().getFullYear()} Human Cancer Models Initiative
        </CopyrightText>
        <FooterNav>
          <FooterNavItem>
            <CopyrightLink
              href="https://ocg.cancer.gov/programs/HCMI"
              target="_blank"
              rel="noopener noreferrer"
            >
              ocg.cancer.gov
            </CopyrightLink>
          </FooterNavItem>
          <FooterNavItem>
            <CopyrightLink
              href="https://ocg.cancer.gov/programs/hcmi/hcmi-tutorials"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </CopyrightLink>
          </FooterNavItem>
          <FooterNavItem>
            <CopyrightLink
              href="mailto:ocg@mail.nih.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </CopyrightLink>
          </FooterNavItem>
        </FooterNav>
      </Row>
    </Col>
    <Col>
      <Row alignItems="center">
        <FooterImg
          src={nihPath}
          alt="NIH"
          css={`
            height: 24px;
          `}
        />
        <FooterImg
          src={sangerPath}
          alt="Wellcome Sanger Institue"
          css={`
            height: 41px;
          `}
        />
        <FooterImg
          src={hubPath}
          alt="Hubrecht Organoid Technology"
          css={`
            height: 41px;
          `}
        />
        <FooterImg
          src={cancerResearchUKPath}
          alt="Cancer Research UK"
          css={`
            height: 41px;
          `}
        />
      </Row>
    </Col>
  </Footer>
);
