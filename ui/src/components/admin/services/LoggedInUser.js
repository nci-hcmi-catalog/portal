import React from 'react';
import config from '../config';
import { Fetcher } from './Fetcher';

export const LoggedInUserContext = React.createContext();

export const LoggedInUserProvider = ({ children }) => (
  <Fetcher url={`${config.urls.cmsBase}/loggedInUser`} method={'get'}>
    {({ data, isLoading }) => (
      <LoggedInUserContext.Provider value={{ user: { email: data.user_email }, isLoading }}>
        {children}
      </LoggedInUserContext.Provider>
    )}
  </Fetcher>
);

export const LoggedInUserPill = props => (
  <LoggedInUserContext.Consumer>
    {({ user, isLoading }) => `rosi.bajari@example.nih.gov`}
  </LoggedInUserContext.Consumer>
);
