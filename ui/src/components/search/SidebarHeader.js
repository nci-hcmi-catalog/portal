import React from 'react';
import { Row } from 'theme/system';

export default ({ onArrowClick, collapsed, children }) => (
  <Row className="header">
    <Row className="title-wrapper">
      <span className={`arrow ${collapsed ? 'collapsed' : ''}`} onClick={onArrowClick} />
      <span className="title">{children}</span>
    </Row>
  </Row>
);
