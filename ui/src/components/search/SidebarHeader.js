/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { Row } from 'theme/system';

const SidebarHeader = ({ onArrowClick, collapsed, children }) => (
  <Row className="header">
    <Row className="title-wrapper">
      <span className={`arrow ${collapsed ? 'collapsed' : ''}`} onClick={onArrowClick} />
      <span className="title">{children}</span>
    </Row>
  </Row>
);

export default SidebarHeader;
