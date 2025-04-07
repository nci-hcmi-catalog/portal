import React from 'react';
import { AdminNav as AdminNavWrapper, NavLink, Account } from 'theme/adminNavStyles';
import { LoginWithGoogle } from './services/GoogleLink';
import { LoggedInUserPill } from './services/LoggedInUser';

// Regex for URLs used in navigation
const [base, manageUsers, modelUploadSingle, manageDictionary] = [
  /\/admin\/?$/,
  /\/admin\/manage-users\/?$/,
  /\/admin\/model(\/.+)?\/?$/,
  /\/admin\/data-dictionary\/?$/,
];

// Nav paths to handle "nested pages"
const [modelsNavPaths, usersNavPaths, dictionaryNavPaths] = [
  [base, modelUploadSingle],
  [manageUsers],
  [manageDictionary],
];

// Nav active state func
const isNavLinkActive = (currentPath, navPaths) =>
  navPaths.filter((path) => currentPath.match(path)).length > 0;

// Exported URLs to be used as needed
export const manageModelsUrlBase = '/admin';
export const manageUsersUrlBase = '/admin/manage-users';
export const modelEditUrlBase = '/admin/model';
export const dataDictionaryUrlBase = '/admin/data-dictionary';

const AdminNav = ({ location: { pathname } }) => (
  <AdminNavWrapper as="nav">
    <div>
      <NavLink
        active={isNavLinkActive(pathname, modelsNavPaths) ? `true` : undefined}
        to={manageModelsUrlBase}
      >
        Model Management
      </NavLink>
      <NavLink
        active={isNavLinkActive(pathname, usersNavPaths) ? `true` : undefined}
        to={manageUsersUrlBase}
      >
        User Management
      </NavLink>
      <NavLink
        active={isNavLinkActive(pathname, dictionaryNavPaths) ? `true` : undefined}
        to={dataDictionaryUrlBase}
      >
        Data Dictionary
      </NavLink>
    </div>
    <Account>
      <LoginWithGoogle />
      <LoggedInUserPill />
    </Account>
  </AdminNavWrapper>
);

export default AdminNav;
