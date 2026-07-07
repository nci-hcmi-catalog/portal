import { buildSearchClient } from '@overture-stack/arranger-graphql-router';
import type { AuthTypes, AuthServices } from '@overture-stack/arranger-types/configs';

import { pm2 } from '../index.ts';

const getClient = async () => {
  const node = process.env.ES_URL || pm2.ES_URL || 'http://localhost:9201';
  const clientType = process.env.SEARCH_ENGINE || pm2.SEARCH_ENGINE || 'opensearch';
  const username = process.env.ES_USER || pm2.ES_USER || '';
  const password = process.env.ES_PASS || pm2.ES_PASS || '';
  const searchEngineAuthType =
    ((process.env.SEARCH_ENGINE_AUTH_TYPE || pm2.SEARCH_ENGINE_AUTH_TYPE) as AuthTypes) ||
    undefined;
  const searchEngineAuthRegion =
    process.env.SEARCH_ENGINE_AUTH_REGION || pm2.SEARCH_ENGINE_AUTH_REGION || undefined;
  const searchEngineAuthService =
    ((process.env.SEARCH_ENGINE_AUTH_SERVICE || pm2.SEARCH_ENGINE_AUTH_SERVICE) as AuthServices) ||
    undefined;
  const auth = username
    ? {
        username,
        password,
        type: searchEngineAuthType,
        region: searchEngineAuthRegion,
        service: searchEngineAuthService,
      }
    : undefined;

  return await buildSearchClient({ node, auth, clientType });
};

export default getClient;
