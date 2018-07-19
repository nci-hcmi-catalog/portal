import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'theme/system';

export default () => (
  <Row className="admin-nav">
    <div className="nav">
      <Link to="/admin/manage-users">Model Management</Link>
      <Link to="/admin/manage-models">User Management</Link>
    </div>
    <div className="account">
      <div className="user">rosi.bajari@oicr.on.ca</div>
      <button className="button">Link Google Account</button>
      <button className="button">Logout</button>
    </div>
  </Row>
);
