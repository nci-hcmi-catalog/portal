module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'hcmi-cms',
      script: 'index.js',
      env: {
        PORT: 8080,
      },
      env_dev: {
        NODE_ENV: 'dev',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
        MONGO_COLLECTION: 'models',
        MONGODB_URI: 'mongodb: //localhost/test',
        ES_INDEX: 'models',
        ES_TYPE: 'models',
        ES_HOST: 'es.hcmi.cancercollaboratory.org',
        ES_PORT: 9200,
        ES_API_VERSION: 6.1,
        ES_LOG_LEVEL: 'error',
      },
      env_qa: {
        NODE_ENV: 'qa',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
      },
      env_prd: {
        NODE_ENV: 'production',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
      },
    },
  ],
};
