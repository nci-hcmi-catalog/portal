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
        ES_UPDATE_INDEX: 'hcmi-update',
      },
      env_dev: {
        NODE_ENV: 'dev',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
        MONGO_COLLECTION: 'models',
        MONGO_USER_COLLECTION: 'users',
        MONGODB_URI: 'mongodb: //localhost/test',
        ES_INDEX: 'hcmi',
        ES_HOST: 'es.hcmi.cancercollaboratory.org',
        ES_PORT: 9200,
        ES_API_VERSION: 6.1,
        ES_LOG_LEVEL: 'error',
        LOG_LEVEL: 'debug',
      },
      env_staging: {
        NODE_ENV: 'staging',
        ES_URL: 'http://es.hcmi.cancercollaboratory.org:9200',
        LOG_LEVEL: 'info',
      },
      env_prd: {
        REDIRECT_URIS: ['http://localhost:5050/'],
        MONGO_URL: 'mongodb://localhost:27017',
        MONGO_DB_NAME: 'hcmi',
        MONGO_COLLECTION: 'models',
        MONGO_USER_COLLECTION: 'users',
        MONGODB_URI: 'mongodb://localhost:27017/hcmi',
        ES_INDEX: 'hcmi',
        ES_HOST: 'http://localhost',
        ES_PORT: 9200,
        ES_API_VERSION: 6.1,
        ES_LOG_LEVEL: 'error',
        AUTH_ENABLED: false,
        S3_BUCKET: 'hcmi-demo',
        IAM_USER_KEY: 'ADD-KEY',
        IAM_USER_SECRET: 'ADD-SECRET',
        LOG_LEVEL: 'info',
      },
    },
  ],
};
