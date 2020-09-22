import globals from 'utils/globals';
import axios from 'axios';

import { get } from 'lodash';

export const searchGenes = async inputValue => {
  try {
    const response = await axios.get(`${globals.ARRANGER_API}/search/gene`, {
      params: { q: inputValue },
    });
    return response.data.genes;
  } catch (e) {
    return [];
  }
};

export const searchVariants = async inputValue => {
  try {
    const response = await axios.get(`${globals.ARRANGER_API}/search/variant`, {
      params: { q: inputValue },
    });
    return response.data.genes;
  } catch (e) {
    return [];
  }
};

/* Search Models uses the Arranger GQL api, this is built on a copy of the query performed by Arranger Quick Search
    It's been modified to remove the size limit (can be added in if speed issues arise) and now also returns primary_site
    This can be modified further to allow a custom list of model properties to return in the search results.
*/
export const searchModels = async inputValue => {
  const query =
    'query ModelsQuickSearchResults($sqon: JSON) {\n          models {\n            hits(filters: $sqon) {\n              total\n              edges {\n                node {\n                  primaryKey: name\n                  autocomplete: autocomplete\n primary_site\n                }\n              }\n            }\n          }\n        }';
  const sqon = {
    op: 'or',
    content: [
      {
        op: 'filter',
        content: { value: `*${inputValue.toLowerCase()}*`, fields: ['autocomplete'] },
      },
    ],
  };
  const variables = { sqon };
  try {
    const response = await axios.post(`${globals.ARRANGER_API}/${globals.VERSION}/graphql`, {
      query,
      variables,
    });
    console.log(inputValue, response);
    return get(response, 'data.data.models.hits.edges', []).map(i => i.node);
  } catch (e) {
    return [];
  }
};
