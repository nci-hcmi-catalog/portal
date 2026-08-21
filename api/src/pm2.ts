import pm2Config from './../pm2.config.js';

// PM2 Env Setup
type pm2EnvValues = 'dev' | 'prd' | 'staging';
const pm2EnvValues: pm2EnvValues[] = ['dev', 'prd', 'staging'];

const pm2Env: pm2EnvValues =
  process.env.ENV && pm2EnvValues.includes(process.env.ENV as pm2EnvValues)
    ? (process.env.ENV as pm2EnvValues)
    : 'dev';

const pm2ConfigBase = pm2Config.apps[0].env;

type pm2EnvKey = keyof (typeof pm2Config.apps)[0];
const envKey: pm2EnvKey = pm2Config.apps[0].hasOwnProperty(`env_${pm2Env}`)
  ? `env_${pm2Env}`
  : `env_dev`;
const pm2ConfigForEnv = pm2Config.apps[0][envKey];

const pm2 = { ...pm2ConfigBase, ...pm2ConfigForEnv };

export type PM2Config = typeof pm2;

export default pm2;
