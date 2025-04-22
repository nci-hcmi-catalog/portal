/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { css } from '@emotion/react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import { NotificationsContext, NOTIFICATION_TYPES } from '../Notifications';
import config from '../config';
import {
  getAuth,
  setAuth,
  removeAuth,
  getToken,
  isTokenExpired,
  getEmailFromToken,
} from '../helpers/googleAuth';

import { UserDropdown, DropdownItem } from 'theme/adminNavStyles';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import GoogleLogo from 'icons/GoogleLogo';
import { visuallyHidden } from 'theme';

export const LoginWithGoogle = ({ children }) => {
  const [state, setState] = useState({
    loggedIn: false,
    email: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { appendNotification } = useContext(NotificationsContext);

  const authError = (errorDetails) => {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'Google Auth Error.',
      timeout: 20000,
      details:
        errorDetails ||
        'Unknown error has occurred. This usually indicates a temporary communication error with Google. Please reload the application in a different browser window to fix this issue. If issue still persists; please contact the support team. You can continue to use the application but you will not be able to bulk import data from Google sheets if this error persists.',
    });
  };

  const googleSignOut = async (e) => {
    e.preventDefault();

    try {
      googleLogout();
      removeAuth();

      setState({
        loggedIn: false,
        email: null,
      });
      setIsOpen(false);

      appendNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Google Auth Success.',
        details: 'Account has been successfully disconnected.',
      });
    } catch (err) {
      authError(err.details);
    }
  };

  const signInSuccess = async ({ code }) => {
    let response;

    try {
      response = await axios.post(`${config.urls.cmsBase}/auth/google`, {
        code,
      });
    } catch (error) {
      authError('An error occurred in the backend while requesting user tokens from Google.');
      console.error(error);
    }

    if (response.data) {
      setAuth(response.data);
      const email = getEmailFromToken(response.data.id_token);

      setState({
        loggedIn: true,
        email: email,
      });

      appendNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Google Auth Success.',
        details: 'Account has been successfully connected.',
      });
    } else {
      authError('An error occurred in the backend while requesting user tokens from Google.');
      console.warn('Google auth code flow token response did not contain `data`: ', response);
    }
  };

  const googleSignIn = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (successResponse) => signInSuccess(successResponse),
    onError: (errorResponse) => {
      authError(errorResponse.error_description);
      console.warn('An error occurred while using Google sign-in: ', errorResponse);
    },
    scope: 'profile email https://www.googleapis.com/auth/spreadsheets',
  });

  const checkGoogleAuth = async () => {
    if (getAuth() && getToken() && !isTokenExpired()) {
      setState({
        loggedIn: true,
        email: getEmailFromToken(),
      });
    }
  };

  useEffect(() => {
    checkGoogleAuth();
  }, []);

  return (
    <>
      {state && state.loggedIn && (
        <div
          css={css`
            position: relative;
          `}
        >
          <Popup
            trigger={() => (
              <div>
                <UserDropdown secondary onClick={() => setIsOpen(!isOpen)} isOpen>
                  <GoogleLogo
                    css={css`
                      margin-right: 4px;
                    `}
                  />
                  Connected: {state.email}
                  <CollapsibleArrow
                    isOpen={isOpen}
                    colour={'#000'}
                    weight={4}
                    css={css`
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
            overlayStyle={{
              zIndex: '1',
            }}
            onClose={() => setIsOpen(false)}
          >
            <DropdownItem onClick={googleSignOut}>Disconnect</DropdownItem>
          </Popup>
        </div>
      )}
      <UserDropdown
        key="google"
        id="googleSignin"
        onClick={() => googleSignIn()}
        secondary
        // visually-hidden when logged in instead of removed from the virtual DOM to maintain binding
        css={state.loggedIn && visuallyHidden}
      >
        <GoogleLogo
          css={css`
            margin-right: 4px;
          `}
        />
        Connect With Google
      </UserDropdown>
      {children}
    </>
  );
};
