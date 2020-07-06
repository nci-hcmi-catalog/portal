import React, { useEffect, useContext, useState } from 'react';
import Popup from 'reactjs-popup';

import { NotificationsContext } from '../Notifications';
import config from '../config';

import { UserDropdown, DropdownItem } from 'theme/adminNavStyles';
import CollapsibleArrow from 'icons/CollapsibleArrow';
import GoogleLogo from 'icons/GoogleLogo';
import { visuallyHidden } from 'theme';

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

export const LoginWithGoogle = ({ children }) => {
  const [state, setState] = useState({
    loggedIn: false,
    googleAuth: null,
    googleUser: null,
    email: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { appendNotification } = useContext(NotificationsContext);

  const authError = errorDetails => {
    appendNotification({
      type: 'error',
      message: 'Google Auth Error.',
      timeout: 20000,
      details:
        errorDetails ||
        'Unknown error has occurred. This usually indicates a temporary communication error with Google. Please reload the application in a different browser window to fix this issue. If issue still persists; please contact the support team. You can continue to use the application but you will not be able to bulk import data from Google sheets if this error persists.',
    });
  };

  const googleSignOut = async e => {
    e.preventDefault();

    const auth2 = await window.gapi.auth2.getAuthInstance();

    if (auth2) {
      auth2
        .signOut()
        .then(success => {
          setState({
            loggedIn: false,
            googleAuth: null,
            googleUser: null,
            email: null,
          });
          setIsOpen(false);
          appendNotification({
            type: 'success',
            message: 'Google Auth Success.',
            details: 'Account has been successfully disconnected.',
          });
        })
        .catch(err => {
          authError(err.details);
        });
    }
  };

  const signInSuccess = async successResponse => {
    const googleAuth = await googleSDK();
    var email = googleAuth.currentUser
      .get()
      .getBasicProfile()
      .getEmail();

    setState({
      loggedIn: true,
      googleAuth: googleAuth,
      googleUser: successResponse.getAuthResponse(),
      email: email,
    });

    appendNotification({
      type: 'success',
      message: 'Google Auth Success.',
      details: 'Account has been successfully connected.',
    });
  };

  const initGoogleSignIn = async () => {
    try {
      const googleAuth = await googleSDK();
      attachGoogleSignIn(
        'googleSignin',
        googleAuth,
        async successResponse => signInSuccess(successResponse),
        err => authError(err.details),
      );
      if (googleAuth.isSignedIn.get()) {
        setState({
          loggedIn: true,
          googleAuth: googleAuth,
          googleUser: googleAuth.currentUser.get(),
          email: googleAuth.currentUser
            .get()
            .getBasicProfile()
            .getEmail(),
        });
      }
    } catch (err) {
      authError(err.details);
    }
  };

  useEffect(() => {
    initGoogleSignIn();
  }, []);

  return (
    <>
      {state && state.loggedIn && (
        <div
          css={`
            position: relative;
          `}
        >
          <Popup
            trigger={() => (
              <div>
                <UserDropdown secondary onClick={() => setIsOpen(!isOpen)} isOpen>
                  <GoogleLogo
                    css={`
                      margin-right: 4px;
                    `}
                  />
                  Connected: {state.email}
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
            onClose={() => setIsOpen(false)}
          >
            <DropdownItem onClick={googleSignOut}>Disconnect</DropdownItem>
          </Popup>
        </div>
      )}
      <UserDropdown
        key="google"
        id="googleSignin"
        secondary
        // visually-hidden when logged in instead of removed from the virtual DOM to maintain binding
        css={state.loggedIn && visuallyHidden}
      >
        <GoogleLogo
          css={`
            margin-right: 4px;
          `}
        />
        Connect With Google
      </UserDropdown>
      {children}
    </>
  );
};
