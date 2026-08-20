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
        ES_URL: 'http://localhost:9200',
        LOG_LEVEL: 'debug',
        ES_USER: 'elastic',
        ES_PASS: 'password',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: undefined,
        SEARCH_ENGINE_AUTH_SERVICE: undefined,
        SEARCH_ENGINE_AUTH_REGION: undefined,
      },
      env_staging: {
        NODE_ENV: 'production',
        DISABLE_GRAPHQL_INTROSPECTION: true,
        ES_URL: 'http://host.docker.internal:9200',
        LOG_LEVEL: 'info',
        ES_USER: 'elastic',
        ES_PASS: 'password',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: 'aws',
        SEARCH_ENGINE_AUTH_REGION: 'us-east-1',
        SEARCH_ENGINE_AUTH_SERVICE: 'es',
      },
      env_prd: {
        NODE_ENV: 'production',
        DISABLE_GRAPHQL_INTROSPECTION: true,
        ES_URL: 'http://host.docker.internal:9200',
        LOG_LEVEL: 'info',
        ES_USER: 'elastic',
        ES_PASS: 'password',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: 'aws',
        SEARCH_ENGINE_AUTH_REGION: 'us-east-1',
        SEARCH_ENGINE_AUTH_SERVICE: 'es',
      },
      env_docker: {
        NODE_ENV: 'production',
        DISABLE_GRAPHQL_INTROSPECTION: true,
        ES_URL: 'http://host.docker.internal:9200',
        LOG_LEVEL: 'info',
        ES_USER: 'elastic',
        ES_PASS: 'password',
        SEARCH_ENGINE: 'opensearch',
        SEARCH_ENGINE_AUTH_TYPE: undefined,
        SEARCH_ENGINE_AUTH_REGION: undefined,
        SEARCH_ENGINE_AUTH_SERVICE: undefined,
      },
    },
  ],
};
