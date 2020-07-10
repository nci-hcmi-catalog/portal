import React from 'react';
import config from '../config';
import { Fetcher } from './Fetcher';
import UserIcon from 'icons/UserIcon';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import { UserDropdown, DropdownItem } from 'theme/adminNavStyles';
import Popup from 'reactjs-popup';
import Component from 'react-component-component';
import base from 'theme';

const {
  keyedPalette: { black },
} = base;

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

export const LoggedInUserPill = () => (
  <LoggedInUserContext.Consumer>
    {({ user }) => (
      <Component initialState={{ isOpen: false }}>
        {({ state: { isOpen }, setState }) => (
          <div
            css={`
              margin-left: 20px;
              position: relative;
            `}
          >
            <Popup
              trigger={() => (
                <div
                  css={`
                    align-items: center;
                    display: inline-flex;
                    postion: relative;
                  `}
                >
                  <UserDropdown secondary onClick={() => setState({ isOpen: !isOpen })} isOpen>
                    <UserIcon
                      css={`
                        margin-right: 5px;
                        position: relative;
                        top: -1px;
                      `}
                      fill={black}
                    />
                    {user.email}
                    <CollapsibleArrow
                      isOpen={isOpen}
                      colour={'#000'}
                      weight={4}
                      css={`
                        margin-left: 4px;
                      `}
                    />
                  </UserDropdown>
                </div>
              )}
              offset={0}
              open={isOpen}
              arrow={false}
              contentStyle={{
                padding: '0px',
                border: '1px solid #b2b7c1',
                borderRadius: '4px',
                width: '100%',
                position: 'absolute',
              }}
              onClose={() => setState({ isOpen: false })}
            >
              <DropdownItem href={`${config.urls.logoutUrl}`}>Logout</DropdownItem>
            </Popup>
          </div>
        )}
      </Component>
    )}
  </LoggedInUserContext.Consumer>
);
