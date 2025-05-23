import React, { useState } from 'react';
import { Row, Col } from 'theme/system';
import SidebarHeader from './SidebarHeader';

const SidebarSection = ({ title, children, ...props }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div // display: flex is causing this component to have zero height for reasons I do not understand.
      className="custom-search-wrapper aggregation-card"
    >
      {title ? (
        <SidebarHeader onArrowClick={() => setCollapsed(!collapsed)} collapsed={collapsed}>
          {title}
        </SidebarHeader>
      ) : null}
      {collapsed ? null : (
        <Col className="search-sidebar-content-wrapper" p={2}>
          <Row className="search-sidebar-content" alignItems="center">
            {children}
          </Row>
        </Col>
      )}
    </div>
  );
};

export default SidebarSection;
