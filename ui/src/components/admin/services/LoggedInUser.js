import React from 'react';
import config from '../config';
import { Fetcher } from './Fetcher';
import UserIcon from 'icons/UserIcon';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import { User, Pill } from 'theme/adminNavStyles';
import Popup from 'reactjs-popup';
import Component from 'react-component-component';

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
    {({ user }) => (
      <Component initialState={{ isOpen: false }}>
        {({ state: { isOpen }, setState }) => (
          <Popup
            trigger={() => (
              <div
                css={`
                  align-items: center;
                  display: inline-flex;
                  postion: relative;
                `}
              >
                <Pill onClick={() => setState({ isOpen: !isOpen })}>
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
                  {CollapsibleArrow({ isOpen })}
                </Pill>
              </div>
            )}
            position="bottom right"
            offset={0}
            open={isOpen}
            contentStyle={{
              padding: '0px',
              border: 'none',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              width: 'max-content',
              minWidth: '172px',
            }}
            arrow={false}
          >
            <Pill onClick={() => 'logout'}>Logout</Pill>
          </Popup>
        )}
      </Component>
    )}
  </LoggedInUserContext.Consumer>
);
