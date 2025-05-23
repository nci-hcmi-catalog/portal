import React, { useState, useContext } from 'react';
import { useArrangerData } from '@overture-stack/arranger-components/';
import { css } from '@emotion/react';
import { get, uniqBy } from 'lodash';
import { stringify } from 'query-string';
import { Link } from 'react-router-dom';

import SparkMeter from 'components/SparkMeter';

import { VARIANT_TYPES } from 'utils/constants';

export const VariantsContext = React.createContext([{}, () => {}]);

export const VariantsProvider = (props) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [geneMetadata, setGeneMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <VariantsContext.Provider
      value={[
        [data, setData],
        [filteredData, setFilteredData],
        [geneMetadata, setGeneMetadata],
        [loading, setLoading],
        [page, setPage],
        [pageSize, setPageSize],
      ]}
    >
      {props.children}
    </VariantsContext.Provider>
  );
};

export const useVariants = () => {
  const [
    [data, setData],
    [filteredData, setFilteredData],
    [geneMetadata, setGeneMetadata],
    [loading, setLoading],
    [page, setPage],
    [pageSize, setPageSize],
  ] = useContext(VariantsContext);

  const { apiFetcher } = useArrangerData({
    callerName: `VariantsProvider`,
  });

  const getData = () => {
    if (!data) return [];
    return data;
  };

  const getGeneMetadata = () => {
    if (!geneMetadata) return null;
    return geneMetadata;
  };

  const getFilteredData = () => {
    if (!filteredData) return [];
    return filteredData;
  };

  const getLoading = () => {
    if (!loading) return false;
    return loading;
  };

  const getPage = () => {
    if (!page) return 0;
    return page;
  };

  const getPageSize = () => {
    if (!pageSize) return 10;
    return pageSize;
  };

  const getGenomicVariants = async (modelName) => {
    const query = `query GenomicVariants($sqon: JSON) {
      model {
        hits(filters: $sqon, first: 1) {
          edges {
            node {
            name
              genomic_variants {
                hits {
                  edges {
                    node {
                      gene
                      aa_change
                      transcript_id
                      consequence_type
                      class
                      chromosome
                      start_position
                      end_position
                      specific_change
                      classification
                      entrez_id
                      variant_id
                      name
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const modelsSqon = {
      content: [{ op: 'in', content: { fieldName: 'name', value: modelName } }],
      op: 'and',
    };

    const response = await apiFetcher({
      body: { query, variables: { sqon: modelsSqon } },
      endpointTag: 'GenomicVariants',
    });

    const data = get(response, `data.model.hits.edges[0].node.genomic_variants.hits.edges`, []).map(
      ({ node }) => node,
    );

    return data.length && data.length > 0
      ? data
          .filter((variant) => !!variant.gene)
          .map((variant) => {
            const entrez_link = `https://www.ncbi.nlm.nih.gov/gene/${variant.entrez_id}`;
            const geneComponent =
              variant.entrez_id && variant.entrez_id !== '0' ? (
                <a href={entrez_link} target="_blank" rel="noopener noreferrer">
                  {variant.gene}
                </a>
              ) : (
                variant.gene
              );

            return {
              ...variant,
              gene: {
                name: variant.gene,
                display: geneComponent,
              },
            };
          })
      : [];
  };

  const fetchData = async ({ modelName, type }) => {
    if (type === VARIANT_TYPES.genomic) {
      return getGenomicVariants(modelName);
    }

    const query = `query VariantsData($sqon: JSON) {
      model {
        hits(filters: $sqon, first: 1) {
          edges {
            node {
            name
              variants {
                hits {
                  edges {
                    node {
                      name
                      category
                      assessment_type
                      type
                      expression_level
                      genes
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const modelsSqon = {
      content: [{ op: 'in', content: { fieldName: 'name', value: modelName } }],
      op: 'and',
    };

    const response = await apiFetcher({
      body: { query, variables: { sqon: modelsSqon } },
      endpointTag: 'VariantsData',
    });

    const data = get(response, `data.model.hits.edges[0].node.variants.hits.edges`, [])
      .map(({ node }) => node)
      .filter((node) => node.type && node.type.toLowerCase() === type.toLowerCase());

    const variantNames = uniqBy(
      data.map(({ name }) => ({ name, safe: name.replace(/ |-|\.|\(|\)/g, '') })),
      ({ name }) => name,
    );

    const freqsData = variantNames.length
      ? await apiFetcher({
          endpointTag: 'VariantFreqsData',
          body: {
            query: `query(${variantNames.map(({ safe }) => '$' + safe + ': JSON').join(',')}) {
                  model {
                  all: hits(first: 0) {
                    total
                  }
                  ${variantNames.map(
                    ({ safe }) => `${safe} : hits(filters: ${'$' + safe}, first: 0) {
                      total
                    }`,
                  )}
                  }
                }
              `,
            variables: variantNames.reduce(
              (acc, { name, safe }) => ({
                ...acc,
                [safe]: {
                  op: 'in',
                  content: { fieldName: 'variants.name', value: name },
                },
              }),
              {},
            ),
          },
        })
      : { data: { model: [] } };

    const freqs = Object.keys(freqsData.data.model).reduce(
      (acc, key) => ({
        ...acc,
        [variantNames.reduce((found, { name, safe }) => (safe === key ? name : found), '')]:
          freqsData.data.model[key].total,
      }),
      {},
    );

    const dataWithFreqs = data.map((d) => ({
      ...d,
      genes: (d.genes || '').join(', '),
      frequency: {
        display: (
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;
            `}
          >
            <Link
              style={{ display: 'inline-block', width: '23px' }}
              to={{
                pathname: '/',
                search: stringify({
                  sqon: JSON.stringify({
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: { fieldName: 'variants.name', value: d.name },
                      },
                    ],
                  }),
                }),
              }}
            >
              {get(freqs, d.name, 0)}
            </Link>
            <SparkMeter
              width={47}
              percentage={get(freqs, d.name, 0) / get(freqsData, 'data.model.all.total', 0)}
            />
            {((get(freqs, d.name, 0) / get(freqsData, 'data.model.all.total', 0)) * 100).toFixed(2)}
            %
          </div>
        ),
        export: `${(
          (get(freqs, d.name, 0) / get(freqsData, 'data.model.all.total', 0)) *
          100
        ).toFixed(2)}%`,
        raw: get(freqs, d.name, 0),
      },
    }));

    return dataWithFreqs;
  };

  const fetchGeneMetadata = async (modelName) => {
    const query = `query GeneMetadata($sqon: JSON) {
      model {
        hits(filters: $sqon, first: 1) {
          edges {
            node {
              name
              gene_metadata {
                filename
                import_date
              }
            }
          }
        }
      }
    }`;

    const modelSqon = {
      content: [{ op: 'in', content: { fieldName: 'name', value: modelName } }],
      op: 'and',
    };

    const response = await apiFetcher({
      body: { query, variables: { sqon: modelSqon } },
      endpointTag: 'GeneMetadata',
    });

    const data = get(response, `data.models.hits.edges[0].node.gene_metadata`);

    setGeneMetadata(data);

    return data;
  };

  const sortFilteredData = (a, b) => {
    if (!a || !a.frequency || !a.frequency.raw || !b || !b.frequency || !b.frequency.raw) {
      return false;
    }
    return b.frequency.raw - a.frequency.raw;
  };

  return {
    data: getData(),
    filteredData: getFilteredData(),
    geneMetadata: getGeneMetadata(),
    loading: getLoading(),
    page: getPage(),
    pageSize: getPageSize(),
    setData,
    setFilteredData,
    setGeneMetadata,
    setLoading,
    setPage,
    setPageSize,
    fetchData,
    fetchGeneMetadata,
    sortFilteredData,
  };
};
