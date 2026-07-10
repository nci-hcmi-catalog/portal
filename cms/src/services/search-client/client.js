import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const getClient = (pm2config) => {
  const node = process.env.ES_URL || pm2config?.ES_URL || 'http://localhost:9200';
  const authType = process.env.SEARCH_ENGINE_AUTH_TYPE || pm2config?.SEARCH_ENGINE_AUTH_TYPE || '';
  const region =
    process.env.SEARCH_ENGINE_AUTH_REGION || pm2config?.SEARCH_ENGINE_AUTH_REGION || '';
  const service =
    process.env.SEARCH_ENGINE_AUTH_SERVICE || pm2config?.SEARCH_ENGINE_AUTH_SERVICE || '';
  const username = process.env.ES_USER || pm2config?.ES_USER || '';
  const password = process.env.ES_PASS || pm2config?.ES_PASS || '';

  return authType === 'aws'
    ? new Client({
        ...AwsSigv4Signer({
          region,
          service,
          getCredentials: () => defaultProvider()(),
        }),
        node,
      })
    : new Client({
        node,
        auth: username ? { username, password } : undefined,
      });
};

export default getClient;
