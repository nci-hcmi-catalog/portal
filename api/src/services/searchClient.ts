import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const getClient = (pm2Configs) => {
  const node = process.env.ES_URL || pm2Configs?.ES_URL || 'http://localhost:9200';
  const authType = process.env.SEARCH_ENGINE_AUTH_TYPE || pm2Configs?.SEARCH_ENGINE_AUTH_TYPE || '';
  const region =
    process.env.SEARCH_ENGINE_AUTH_REGION || pm2Configs?.SEARCH_ENGINE_AUTH_REGION || '';
  const service =
    process.env.SEARCH_ENGINE_AUTH_SERVICE || pm2Configs?.SEARCH_ENGINE_AUTH_SERVICE || '';
  const username = process.env.ES_USER || pm2Configs?.ES_USER || '';
  const password = process.env.ES_PASS || pm2Configs?.ES_PASS || '';

  const esClient =
    authType === 'aws'
      ? new Client({
          ...AwsSigv4Signer({
            region,
            service: service as 'es' | 'aoss',
            getCredentials: () => defaultProvider()(),
          }),
          node,
        })
      : new Client({
          node,
          auth: username ? { username, password } : undefined,
        });

  return esClient;
};

export default getClient;
