import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'theme/system';
import styles from 'theme/adminNavStyles';
import UserIcon from 'icons/UserIcon';

// Urls used in navigation
const [base, manageUsersUrl, manageModelsUrl] = [
  '/admin',
  '/admin/manage-users',
  '/admin/manage-models',
];

// Nav paths to handle "nested pages"
const [modelsNavPaths, usersNavPaths] = [[base, manageUsersUrl], [manageModelsUrl]];

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
      <div className="user">
        <UserIcon
          width={12}
          heigh={13}
          css={`
            position: relative;
            top: 2px;
            margin-right: 5px;
          `}
        />
        lorem.ipsum@todo.on.ca
      </div>
      <button className="pill">Link Google Account</button>
      <button className="pill">Logout</button>
    </div>
  </Row>
);
