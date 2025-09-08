import React from 'react';
import { Row } from '~/theme/system';
import facetarrow from '~/assets/icon-facetarrow.svg';

const SidebarHeader = ({ onArrowClick, collapsed, children }) => (
  <Row className="header">
    <Row className="title-wrapper" onClick={onArrowClick}>
      <span>
        <img className={`arrow ${collapsed ? 'collapsed' : ''}`} src={facetarrow} alt="Arrow" />
      </span>
      <span className="title">{children}</span>
    </Row>
  </Row>
);

export default SidebarHeader;
