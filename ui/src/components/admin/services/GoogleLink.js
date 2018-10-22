import React from 'react';
import Component from 'react-component-component';

import { NotificationsContext } from '../Notifications';
import config from '../config';

import { Pill as NavPill, HoverPill } from 'theme/adminNavStyles';
import AdminGoogleLinked from 'icons/AdminGoogleLinked';

const { googleAppId } = config;

export const googleSDK = () => {
  return new Promise((resolve, reject) => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2
        .init({
          client_id: googleAppId,
          scope: 'profile email https://www.googleapis.com/auth/spreadsheets',
        })
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
  });
};

const attachGoogleSignIn = (elementId, googleAuth, onSuccess, onFailure) => {
  const element = document.getElementById(elementId);
  googleAuth.attachClickHandler(element, {}, onSuccess, onFailure);
};

export const LoginWithGoogle = () => (
  <NotificationsContext>
    {({ appendNotification }) => (
      <Component
        initialState={{
          loggedIn: false,
          googleUser: null,
        }}
        didMount={async ({ setState }) => {
          try {
            const googleAuth = await googleSDK();
            if (!googleAuth.isSignedIn.get()) {
              attachGoogleSignIn(
                'googleSignin',
                googleAuth,
                async successResponse => {
                  await setState({
                    loggedIn: true,
                    googleUser: successResponse.getAuthResponse(),
                  });

                  await appendNotification({
                    type: 'success',
                    message: 'Google Auth Success.',
                    details: 'Account has been successfully linked.',
                  });
                },
                err =>
                  appendNotification({
                    type: 'error',
                    message: 'Google Auth Error.',
                    timeout: 20000,
                    details:
                      err.details ||
                      'Unknown error has occurred. This usually indicates a temporary communication error with Google. Please reload the application in a different browser window to fix this issue. If issue still persists; please contact the support team. You can continue to use the application but you will not be able to bulk import data from Google sheets if this error persists.',
                  }),
              );
            } else {
              setState({
                loggedIn: true,
                googleUser: googleAuth.currentUser.get(),
              });
            }
          } catch (err) {
            debugger;
            appendNotification({
              type: 'error',
              message: 'Google Auth Error.',
              timeout: 20000,
              details:
                err.details ||
                'Unknown error has occurred. This usually indicates a temporary communication error with Google. Please reload the application in a different browser window to fix this issue. If issue still persists; please contact the support team. You can continue to use the application but you will not be able to bulk import data from Google sheets if this error persists.',
            });
          }
        }}
      >
        {({ state: { loggedIn }, children }) => {
          return (
            <>
              {loggedIn ? (
                <NavPill
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
                </NavPill>
              ) : (
                <HoverPill key="google" id="googleSignin">
                  Link With Google
                </HoverPill>
              )}
              {children}
            </>
          );
        }}
      </Component>
    )}
  </NotificationsContext>
);
