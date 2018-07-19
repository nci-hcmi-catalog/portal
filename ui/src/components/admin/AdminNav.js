import React from 'react';
import { AdminNav, NavLink, Account, User, Pill } from 'theme/adminNavStyles';
import UserIcon from 'icons/UserIcon';

// Urls used in navigation
const [base, manageUsersUrl, manageModelsUrl] = [
  '/admin',
  '/admin/manage-users',
  '/admin/manage-models',
];

// Nav paths to handle "nested pages"
const [modelsNavPaths, usersNavPaths] = [[base, manageModelsUrl], [manageUsersUrl]];

// Nav active state func
const isNavLinkActive = (currentPath, navPaths) =>
  navPaths.indexOf(currentPath.replace(/\/$/, '')) !== -1;

export default ({ location: { pathname } }) => (
  <AdminNav>
    <div>
      <NavLink className='test' active={isNavLinkActive(pathname, modelsNavPaths)} to={manageModelsUrl}>
        Model Management
      </NavLink>
      <NavLink active={isNavLinkActive(pathname, usersNavPaths)} to={manageUsersUrl}>
        User Management
      </NavLink>
    </div>
    <Account>
      <User>
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
      </User>
      <Pill>Link Google Account</Pill>
      <Pill last>Logout</Pill>
    </Account>
  </AdminNav>
);
