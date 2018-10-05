import User from '../schemas/user';
import { userStatus } from './userStatus';
export const USER_EMAIL = 'user_email';

const userExistsAndActive = userEmail => {
  return User.findOne({ email: userEmail.toLowerCase() }, (err, user) => {
    return err ? false : user.status === userStatus.active ? true : false;
  });
};
export default req => {
  return req.headers[USER_EMAIL] && userExistsAndActive(req.headers[USER_EMAIL]);
};
