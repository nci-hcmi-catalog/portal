import pm2Config from './../pm2.config.js';

const pm2Env = process.env.ENV;
if (!pm2Env) {
  throw new Error('No ENV value provided!');
}
const pm2ConfigBase = pm2Config.apps[0].env;
const pm2ConfigForEnv = pm2Config.apps[0][`env_${pm2Env}`] || {};

const pm2 = { ...pm2ConfigBase, ...pm2ConfigForEnv };

export default pm2;
