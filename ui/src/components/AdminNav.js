import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'components/Layout';

export default () => (
  <Col p={15}>
    <Link to="/admin/manage_users">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Manage Users</Row>
        </Col>
      </Row>
    </Link>
    <Link to="/admin/single_model_upload">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Single Model Upload</Row>
        </Col>
      </Row>
    </Link>
    <Link to="/admin/bulk_model_upload">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Bulk Model Upload</Row>
        </Col>
      </Row>
    </Link>
    <Link to="/admin/manage_models">
      <Row>
        <Row p={10}>icon</Row>
        <Col p={10}>
          <Row>Manage Models</Row>
        </Col>
      </Row>
    </Link>
  </Col>
);
