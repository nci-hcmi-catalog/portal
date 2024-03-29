import React from 'react';
import { css } from '@emotion/react';

import {
  Footer as FooterWrapper,
  FooterNav,
  FooterNavItem,
  FooterImg,
  CopyrightText,
  FooterLink,
} from 'theme/searchStyles';
import { Col, Row } from 'theme/system';
import nihPath from 'assets/logo-NIH-NCI.svg';
import sangerPath from 'assets/logo-wellcome-sanger-institute.svg';
import hubPath from 'assets/logo-hub-organoids.svg';
import cancerResearchUKPath from 'assets/logo-cancer-research-UK.svg';

const Footer = () => (
  <FooterWrapper>
    <Col>
      <Row alignItems="center">
        <CopyrightText>&copy; {new Date().getFullYear()}</CopyrightText>
        <FooterNav>
          <FooterNavItem>
            <FooterLink
              href="https://www.cancer.gov/ccg/research/functional-genomics/hcmi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Human Cancer Models Initiative
            </FooterLink>
          </FooterNavItem>
          <FooterNavItem>
            <FooterLink
              href="https://www.cancer.gov/ccg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Center for Cancer Genomics
            </FooterLink>
          </FooterNavItem>
          <FooterNavItem>
            <FooterLink
              href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              HHS Vulnerability Disclosure
            </FooterLink>
          </FooterNavItem>
          <FooterNavItem>
            <FooterLink
              href="https://www.cancer.gov/ccg/research/functional-genomics/hcmi/using-hcmi/searchable-catalog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </FooterLink>
          </FooterNavItem>
          <FooterNavItem>
            <FooterLink
              href="mailto:NCICCGenomics@mail.nih.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </FooterLink>
          </FooterNavItem>
        </FooterNav>
      </Row>
    </Col>
    <Col>
      <Row alignItems="center">
        <FooterImg
          src={nihPath}
          alt="NIH"
          css={css`
            height: 24px;
          `}
        />
        <FooterImg
          src={sangerPath}
          alt="Wellcome Sanger Institue"
          css={css`
            height: 41px;
          `}
        />
        <FooterImg
          src={hubPath}
          alt="Hubrecht Organoid Technology"
          css={css`
            max-height: 41px;
            width: 200px;
          `}
        />
        <FooterImg
          src={cancerResearchUKPath}
          alt="Cancer Research UK"
          css={css`
            height: 41px;
          `}
        />
      </Row>
    </Col>
  </FooterWrapper>
);

export default Footer;
