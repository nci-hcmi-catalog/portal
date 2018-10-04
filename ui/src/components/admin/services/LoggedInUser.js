import React from 'react';
import config from '../config';
import { Fetcher } from './Fetcher';
import UserIcon from 'icons/UserIcon';
import { User, Pill } from 'theme/adminNavStyles';

export const LoggedInUserContext = React.createContext();

export const LoggedInUserProvider = ({ children }) => (
  <Fetcher url={`${config.urls.cmsBase}/loggedInUser`} method={'get'}>
    {({ data, isLoading }) => {
      let email = isLoading ? '' : data.user_email;
      return (
        <LoggedInUserContext.Provider value={{ user: { email: email } }}>
          {children}
        </LoggedInUserContext.Provider>
      );
    }}
  </Fetcher>
);

export const LoggedInUserPill = props => (
  <LoggedInUserContext.Consumer>
    {({ user, isLoading }) => (
      <>
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
          {user.email}
        </User>
        <Pill last>Logout</Pill>
      </>
    )}
  </LoggedInUserContext.Consumer>
);
