import React from 'react';
import Component from 'react-component-component';
import { Pill } from 'theme/adminNavStyles';
import config from '../config';
import AdminGoogleLinked from 'icons/AdminGoogleLinked';

const { googleAppId } = config;

export const googleSDK = () => {
  return new Promise((resolve, reject) => {
    const gapi = global.gapi;
    gapi.load('auth2', () => {
      gapi.auth2
        .init({
          client_id: googleAppId,
          scope: 'profile email https://www.googleapis.com/auth/spreadsheets.readonly',
        })
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
  });
};

const attachGoogleSignIn = (elementId, googleAuth, onSuccess, onFailure) => {
  const element = document.getElementById('googleSignin');
  googleAuth.attachClickHandler(element, {}, onSuccess, onFailure);
};

const handleAuthError = err => ({ googleAuthError: true, authErrorMessage: err });

export const LoginWithGoogle = ({ children, ...props }) => (
  <Component
    initialState={{
      googleAuthError: false,
      authErrorMessage: '',
      loggedIn: false,
      googleUser: null,
    }}
    didMount={async ({ state, setState }) => {
      try {
        const googleAuth = await googleSDK();
        if (!googleAuth.isSignedIn.get()) {
          attachGoogleSignIn(
            'googleSignin',
            googleAuth,
            successResponse =>
              setState({
                loggedIn: true,
                googleUser: successResponse.getAuthResponse(),
              }),
            err => setState(handleAuthError(err)),
          );
        } else {
          setState({
            loggedIn: true,
            googleUser: googleAuth.currentUser.get(),
          });
        }
      } catch (err) {
        setState(handleAuthError(err));
      }
    }}
  >
    {({ state: { loggedIn }, setState, children, ...props }) => {
      return (
        <>
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
            <Pill key="google" id="googleSignin">
              Link With Google
            </Pill>
          )}
          {children}
        </>
      );
    }}
  </Component>
);
