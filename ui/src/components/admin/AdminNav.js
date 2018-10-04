import React from 'react';
import { AdminNav, NavLink, Account } from 'theme/adminNavStyles';
import { LoginWithGoogle } from './services/GoogleLink';
import { LoggedInUserPill } from './services/LoggedInUser';

// Regex for URLs used in navigation
const [base, manageUsers, modelUploadSingle] = [
  /\/admin\/?$/,
  /\/admin\/manage-users\/?$/,
  /\/admin\/model(\/.+)?\/?$/,
];

// Nav paths to handle "nested pages"
const [modelsNavPaths, usersNavPaths] = [[base, modelUploadSingle], [manageUsers]];

// Nav active state func
const isNavLinkActive = (currentPath, navPaths) =>
  navPaths.filter(path => currentPath.match(path)).length > 0;

// Exported URLs to be used as needed
export const manageModelsUrlBase = '/admin';
export const manageUsersUrlBase = '/admin/manage-users';
export const modelEditUrlBase = '/admin/model';

export default ({ location: { pathname } }) => (
  <AdminNav>
    <div>
      <NavLink active={isNavLinkActive(pathname, modelsNavPaths)} to={manageModelsUrlBase}>
        Model Management
      </NavLink>
      <NavLink active={isNavLinkActive(pathname, usersNavPaths)} to={manageUsersUrlBase}>
        User Management
      </NavLink>
    </div>
    <Account>
      <LoginWithGoogle />
      <LoggedInUserPill />
    </Account>
  </AdminNav>
);
