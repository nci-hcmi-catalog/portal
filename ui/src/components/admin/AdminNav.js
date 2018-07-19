import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'theme/system';
import styles from 'theme/adminNavStyles';

// Urls used in navigation
const { base, manageUsersUrl, manageModelsUrl } = {
  base: '/admin',
  manageUsersUrl: '/admin/manage-users',
  manageModelsUrl: '/admin/manage-models',
};

// Nav paths to handle "nested pages"
const { modelsNavPaths, usersNavPaths } = {
  models: [base, manageUsersUrl],
  users: [manageModelsUrl],
};

// Nav active state func
const navLinkClassname = (currentPath, navPaths) =>
  navPaths.indexOf(currentPath.replace(/\/$/, '')) !== -1 ? 'nav-link active' : 'nav-link';

export default ({ location: { pathname } }) => (
  <Row className="admin-nav" css={styles}>
    <div className="nav">
      <Link className={navLinkClassname(pathname, modelsNavPaths)} to={manageUsersUrl}>
        Model Management
      </Link>
      <Link className={navLinkClassname(pathname, usersNavPaths)} to={manageModelsUrl}>
        User Management
      </Link>
    </div>
    <div className="account">
      <div className="user">rosi.bajari@oicr.on.ca</div>
      <button className="button">Link Google Account</button>
      <button className="button">Logout</button>
    </div>
  </Row>
);
