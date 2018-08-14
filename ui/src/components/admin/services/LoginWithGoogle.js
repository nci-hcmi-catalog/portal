import React from 'react';
import Component from 'react-component-component';
import { Pill } from 'theme/adminNavStyles';
import config from '../config';
import AdminGoogleLinked from 'icons/AdminGoogleLinked';

const { googleAppId } = config;

const googleSDK = () => {
  return new Promise((resolve, reject) => {
    const gapi = global.gapi;
    gapi.load('auth2', () => {
      gapi.auth2
        .init({ client_id: googleAppId })
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
  });
};

const handleAuthError = err => ({ googleAuthError: true, authErrorMessage: err });

export const LoginWithGoogle = ({ children, ...props }) => (
  <Component
    initialState={{
      googleAuthError: false,
      authErrorMessage: '',
      loggedIn: false,
    }}
    didMount={async ({ state, setState }) => {
      try {
        await googleSDK();
        global.gapi.signin2.render('googleSignin', {
          scope: 'profile email https://www.googleapis.com/auth/spreadsheets.readonly',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const { id_token } = googleUser.getAuthResponse();
            setState({ loggedIn: true });
            console.log(googleUser.getAuthResponse());
          },
          onfailure: err => setState(handleAuthError(err)),
        });
      } catch (err) {
        setState(handleAuthError(err));
      }
    }}
  >
    {({ state: { loggedIn }, setState, children, ...props }) => {
      return (
        <>
          {' '}
          {loggedIn ? (
            <Pill
              css={`
                width: 160px;
                height: 30px;
              `}
            >
              <AdminGoogleLinked
                css={`
                  paddingright: 3px;
                  width: 18px;
                  height: 18px;
                `}
              />Google Linked
            </Pill>
          ) : (
            <div key="google" id="googleSignin" />
          )}
          {children}{' '}
        </>
      );
    }}
  </Component>
);
