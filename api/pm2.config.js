module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'hcmi-api',
      script: 'index.js',
      output: '../../logs/out.log',
      error: '../../logs/error.log',
      log: '../../logs/combined.outerr.log',
      env: {
        PORT: 5050,
        ES_UPDATE_INDEX: 'hcmi-update',
      },
      env_dev: {
        NODE_ENV: 'dev',
        ES_URL: 'http://ncias-d2019-v:9200',
      },
      env_staging: {
        NODE_ENV: 'staging',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
      },
      env_prd: {
        NODE_ENV: 'production',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
      },
    },
  ],
};
