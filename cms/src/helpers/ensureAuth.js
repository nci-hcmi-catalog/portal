import { getAuthClient } from '../services/import/SheetsToMongo';

const ensureAuth = function(req) {
  return new Promise((resolve, reject) => {
    const {
      headers: { authorization },
    } = req;

    //TODO: error handling if auth is not passed or invalid
    try {
      const authClient = getAuthClient(authorization);
      resolve(authClient);
    } catch (error) {
      reject(error);
    }
  });
};

export default ensureAuth;
