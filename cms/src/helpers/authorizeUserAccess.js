import User from '../schemas/user';
import { userStatus } from './userStatus';

const userExistsAndActive = userEmail => {
  return User.findOne({ email: userEmail }, (err, user) => {
    return err ? false : user.status === userStatus.active ? true : false;
  });
};
export default req => {
  req.headers['USER_EMAIL'] && userExistsAndActive(req.headers['USER_EMAIL']);
};
