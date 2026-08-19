import pm2Config from './../pm2.config.js';

// PM2 Env Setup
type pm2EnvValues = 'dev' | 'prd' | 'staging';

const pm2EnvValues = ['dev', 'prd', 'staging'];
const pm2Env: pm2EnvValues =
  process.env.ENV && pm2EnvValues.includes(process.env.ENV)
    ? (process.env.ENV as pm2EnvValues)
    : 'dev';

const pm2ConfigGeneric =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0].env) || {};
const pm2ConfigForEnv =
  (pm2Config && pm2Config.apps && pm2Config.apps[0] && pm2Config.apps[0][`env_${pm2Env}`]) || {};

const pm2 = { ...pm2ConfigGeneric, ...pm2ConfigForEnv };

export type PM2Config = typeof pm2;

export default pm2;
