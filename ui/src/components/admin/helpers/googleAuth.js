import jwt_decode from 'jwt-decode';

const GOOGLE_AUTH_KEY = 'HCMI_GOOGLE_AUTH';

/*
  AuthResponse object: https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse
  Returned after Google sign-in, used to authorize requests in CMS backend
 */
export const getAuth = () => {
  return JSON.parse(localStorage.getItem(GOOGLE_AUTH_KEY));
};

export const setAuth = (googleAuth) => {
  localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(googleAuth));
};

export const removeAuth = () => {
  localStorage.removeItem(GOOGLE_AUTH_KEY);
};

/*
  ID Token (JWT): https://developers.google.com/identity/protocols/oauth2/openid-connect#obtainuserinfo
  Part of AuthResponse returned after Google sign-in, contains user info
 */
export const getToken = () => {
  return getAuth()?.id_token;
};

export const decodeToken = (googleJwt) => {
  const token = googleJwt || getToken();

  try {
    const decoded = jwt_decode(token);
    return decoded;
  } catch (err) {
    console.warn('Error decoding JWT: ', err);
    return null;
  }
};

export const getTokenValue = (key, googleJwt) => {
  const token = googleJwt || getToken();
  const decoded = decodeToken(token);

  if (decoded && decoded.hasOwnProperty(key)) {
    return decoded[key];
  }

  return null;
};

// Basic JWT expiry check for UI, proper validation in CMS
export const isTokenExpired = (googleJwt) => {
  const token = googleJwt || getToken();
  const expiry = getTokenValue('exp', token);

  return !expiry || expiry <= new Date() / 1000;
};

export const getEmailFromToken = (googleJwt) => {
  const token = googleJwt || getToken();

  return getTokenValue('email', token);
};
