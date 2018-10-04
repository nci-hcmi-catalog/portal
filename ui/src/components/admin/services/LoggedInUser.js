import React from 'react';
import config from '../config';
import { Fetcher } from './Fetcher';
import UserIcon from 'icons/UserIcon';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import { User, AnchorTag } from 'theme/adminNavStyles';
import Popup from 'reactjs-popup';
import Component from 'react-component-component';
import base from 'theme';

const {
  keyedPalette: { brandPrimary },
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
                  <User onClick={() => setState({ isOpen: !isOpen })}>
                    <div
                      css={`
                        padding-top: 1px;
                        padding-bottom: 1px;
                      `}
                    >
                      <UserIcon
                        width={12}
                        heigh={13}
                        css={`
                          position: relative;
                          top: 2px;
                          margin-right: 5px;
                        `}
                        fill={brandPrimary}
                      />
                      <span
                        css={`
                          padding: 2px;
                          height: 30px;
                        `}
                      >
                        {user.email}
                      </span>
                      {CollapsibleArrow({ isOpen })}
                    </div>
                  </User>
                </div>
              )}
              position="bottom center"
              offset={0}
              open={isOpen}
              arrow={false}
              contentStyle={{
                padding: '0px',
                border: 'none',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                width: 'max-content',
                minWidth: '152px',
              }}
            >
              <AnchorTag href={`${config.urls.logoutUrl}`}>Logout</AnchorTag>
            </Popup>
          </div>
        )}
      </Component>
    )}
  </LoggedInUserContext.Consumer>
);
