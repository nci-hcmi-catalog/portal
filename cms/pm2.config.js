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
        AUTH_ENABLED: false,
        ES_INDEX: 'hcmi',
        ES_HOST: 'http://host.docker.internal',
        ES_PASS: 'password',
        ES_PORT: 9200,
        ES_URL: 'http://host.docker.internal:9200',
        ES_USER: 'elastic',
        IAM_USER_KEY: 'ADD-KEY',
        IAM_USER_SECRET: 'ADD-SECRET',
        LOG_LEVEL: 'debug',
        NODE_ENV: 'dev',
        MONGO_COLLECTION: 'models',
        MONGO_DB_NAME: 'hcmi',
        MONGODB_URI: 'mongodb://host.docker.internal:27017/hcmi',
        MONGO_URL: 'mongodb://host.docker.internal:27017',
        MONGO_USER_COLLECTION: 'users',
        REDIRECT_URIS: ['http://localhost:5050/'],
        S3_BUCKET: 'hcmi-demo',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: undefined,
        SEARCH_ENGINE_AUTH_REGION: undefined,
        SEARCH_ENGINE_AUTH_SERVICE: undefined,
      },
      env_staging: {},
      env_prd: {},
    },
  ],
};
