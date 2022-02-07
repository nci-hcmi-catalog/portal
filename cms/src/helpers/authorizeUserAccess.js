import User from '../schemas/user';
import { userStatus } from './userStatus';

import getLogger from '../logger';
const logger = getLogger('helpers/authorizeUserAccess');

export const USER_EMAIL = 'user_email';

export const getLoggedInUser = req => ({
  user_email: req.headers[USER_EMAIL] || 'ANONYMOUS@UNKNOWN.DOMAIN',
});

const userExistsAndActive = async userEmail => {
  try {
    const user = await User.findOne({ email: userEmail.toLowerCase() }).exec();
    return user && user.status === userStatus.active ? true : false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const isUserAuthorized = async req => {
  return !!req.headers[USER_EMAIL] && (await userExistsAndActive(req.headers[USER_EMAIL]));
};

export default isUserAuthorized;
