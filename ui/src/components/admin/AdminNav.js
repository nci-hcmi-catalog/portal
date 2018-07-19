import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'theme/system';

export default () => (
  <Col p={15}>
    <Link to="/admin/manage-users">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Manage Users</Row>
        </Col>
      </Row>
    </Link>
    <Link to="/admin/manage-models">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Manage Models</Row>
        </Col>
      </Row>
    </Link>
  </Col>
);
