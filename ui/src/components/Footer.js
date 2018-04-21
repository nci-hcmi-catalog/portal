import React from 'react';

import { Col } from 'theme/system';
import ExternalLink from 'components/ExternalLink';

const Footer = () => (
  <footer
    css={`
      height: 114px;
      background-color: #323232;
      box-shadow: 0 0 4.9px 0.1px #bbbbbb;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      flex: none;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-family: 'Open Sans';
      font-size: 14px;

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
    <Col alignItems="center">
      <span>
        <ExternalLink href="https://ocg.cancer.gov/">NCI Office of Cancer Genomics</ExternalLink> /{' '}
        <ExternalLink href="https://www.cancer.gov/policies/privacy-security">Policy</ExternalLink>{' '}
        /{' '}
        <ExternalLink href="http://www.cancer.gov/global/web/policies/page3">
          Accessibility
        </ExternalLink>{' '}
        / <ExternalLink href="http://cancer.gov/global/viewing-files">Viewing Files</ExternalLink> /{' '}
        <ExternalLink href="http://www.cancer.gov/global/web/policies/page6">FOIA</ExternalLink>
      </span>
      <span>
        <ExternalLink href="http://www.hhs.gov/">
          U.S. Department of Health and Human Services
        </ExternalLink>{' '}
        / <ExternalLink href="http://www.nih.gov/">National Institutes of Health</ExternalLink> /{' '}
        <ExternalLink href="http://www.cancer.gov/"> National Cancer Institute</ExternalLink> /{' '}
        <ExternalLink href="http://usa.gov/">USA.gov</ExternalLink>
      </span>
      <span className="tagline">NIH ... Turning Discovery Into Health®</span>
    </Col>
  </footer>
);

export default Footer;
