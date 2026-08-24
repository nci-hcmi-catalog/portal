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
        DISABLE_GRAPHQL_INTROSPECTION: false,
        ES_URL: 'http://host.docker.internal:9200',
        LOG_LEVEL: 'debug',
        ES_USER: 'elastic',
        ES_PASS: 'password',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: undefined,
        SEARCH_ENGINE_AUTH_SERVICE: undefined,
        SEARCH_ENGINE_AUTH_REGION: undefined,
      },
      env_staging: {
        NODE_ENV: 'staging',
        DISABLE_GRAPHQL_INTROSPECTION: true,
        ES_URL: process.env.ES_URL,
        LOG_LEVEL: 'info',
        ES_USER: process.env.ES_USER,
        ES_PASS: process.env.ES_PASS,
        SEARCH_ENGINE: process.env.SEARCH_ENGINE,
        SEARCH_ENGINE_AUTH_TYPE: process.env.SEARCH_ENGINE_AUTH_TYPE,
        SEARCH_ENGINE_AUTH_SERVICE: process.env.SEARCH_ENGINE_AUTH_SERVICE,
        SEARCH_ENGINE_AUTH_REGION: process.env.SEARCH_ENGINE_AUTH_REGION,
      },
      env_prd: {
        NODE_ENV: 'staging',
        DISABLE_GRAPHQL_INTROSPECTION: true,
        ES_URL: process.env.ES_URL,
        LOG_LEVEL: 'info',
        ES_USER: process.env.ES_USER,
        ES_PASS: process.env.ES_PASS,
        SEARCH_ENGINE: process.env.SEARCH_ENGINE,
        SEARCH_ENGINE_AUTH_TYPE: process.env.SEARCH_ENGINE_AUTH_TYPE,
        SEARCH_ENGINE_AUTH_SERVICE: process.env.SEARCH_ENGINE_AUTH_SERVICE,
        SEARCH_ENGINE_AUTH_REGION: process.env.SEARCH_ENGINE_AUTH_REGION,
      },
    },
  ],
};
