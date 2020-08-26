import React, { useState, useContext } from 'react';
import { get, uniqBy } from 'lodash';
import { stringify } from 'query-string';
import { Link } from 'react-router-dom';

import { api } from '@arranger/components';

import SparkMeter from 'components/SparkMeter';

import { VARIANT_TYPES } from 'utils/constants';
import globals from 'utils/globals';

export const VariantsContext = React.createContext([{}, () => {}]);

export const VariantsProvider = props => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <VariantsContext.Provider
      value={[
        [data, setData],
        [filteredData, setFilteredData],
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
    [loading, setLoading],
    [page, setPage],
    [pageSize, setPageSize],
  ] = useContext(VariantsContext);

  const getData = () => {
    if (!data) return [];
    return data;
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

  // TODO: DELETE THIS!
  // returns dummy Research Somatic Variant data
  const generateRSVs = numRSVs => {
    const GENES = ['BRAF', 'IDH1', 'PIK3CA', 'KRA5', 'TP53'];
    const AA_CHANGES = ['V600G', 'R132H', 'E545K', 'H1047R', 'G12D', 'G12V', 'R175H'];
    const CONSEQUENCE_TYPES = ['Missense'];
    const CLASSES = ['SNV'];
    const TYPES = ['Substitution'];
    const NUM_CHROMOSOMES = 23;

    const generated = [];

    for (let i = 0; i < numRSVs; i++) {
      const BASES = ['A', 'T', 'C', 'G'];

      let gene = GENES[Math.floor(Math.random() * GENES.length)];
      let aa_change = AA_CHANGES[Math.floor(Math.random() * AA_CHANGES.length)];
      let consequence_type = CONSEQUENCE_TYPES[Math.floor(Math.random() * CONSEQUENCE_TYPES.length)];
      let variant_class = CLASSES[Math.floor(Math.random() * CLASSES.length)];
      let variant_type = TYPES[Math.floor(Math.random() * TYPES.length)];
      let transcript_id = 'ENST000000288602';
      let chromosome = `chr${Math.floor(Math.random() * NUM_CHROMOSOMES)}`;
      let startBase = BASES.splice(Math.floor(Math.random() * BASES.length), 1)[0];
      let endBase = BASES.splice(Math.floor(Math.random() * BASES.length), 1)[0];
      let startPos = Math.floor(Math.random() * 999999999);

      generated.push({
        gene: gene,
        aa_change: aa_change,
        transcript_id: transcript_id,
        consequence_type: consequence_type,
        class: variant_class,
        type: variant_type,
        chromosome: chromosome,
        start_position: startPos,
        end_position: startPos,
        specific_change: `${startBase}>${endBase}`,
        classification: variant_class,
        variant_id: `${chromosome}:g.${startPos}${startBase}>${endBase}`,
        name: `${gene} ${aa_change}`,
      });
    }

    return generated;
  };

  const fetchData = async ({ modelName, type }) => {
    // TODO: DELETE THIS!
    // returns dummy Research Somatic Variant data
    if (type === VARIANT_TYPES.genomic) {
      return generateRSVs(25);
    }

    const variantsData = await api({
      endpoint: `/${globals.VERSION}/graphql`,
      body: {
        query: `query($modelsSqon: JSON) {
                    models {
                      hits(filters: $modelsSqon, first: 1) {
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
                  }
                `,
        variables: {
          modelsSqon: { op: 'in', content: { field: 'name', value: modelName } },
        },
      },
    });

    const data = get(variantsData, `data.models.hits.edges[0].node.variants.hits.edges`, [])
      .map(({ node }) => node)
      .filter(node => node.type && node.type.toLowerCase() === type.toLowerCase());

    const variantNames = uniqBy(
      data.map(({ name }) => ({ name, safe: name.replace(/ |-|\.|\(|\)/g, '') })),
      ({ name }) => name,
    );

    const freqsData = variantNames.length
      ? await api({
          endpoint: `/${globals.VERSION}/graphql`,
          body: {
            query: `query(${variantNames.map(({ safe }) => '$' + safe + ': JSON').join(',')}) {
                    models {
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
                  content: { field: 'variants.name', value: name },
                },
              }),
              {},
            ),
          },
        })
      : { data: { models: [] } };

    const freqs = Object.keys(freqsData.data.models).reduce(
      (acc, key) => ({
        ...acc,
        [variantNames.reduce(
          (found, { name, safe }) => (safe === key ? name : found),
          '',
        )]: freqsData.data.models[key].total,
      }),
      {},
    );

    const dataWithFreqs = data.map(d => ({
      ...d,
      genes: (d.genes || '').join(', '),
      frequency: {
        display: (
          <div
            css={`
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
                        content: { field: 'variants.name', value: d.name },
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
              percentage={get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)}
            />
            {((get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)) * 100).toFixed(
              2,
            )}
            %
          </div>
        ),
        export: `${(
          (get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0)) *
          100
        ).toFixed(2)}%`,
        raw: get(freqs, d.name, 0),
      },
    }));

    return dataWithFreqs;
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
    loading: getLoading(),
    page: getPage(),
    pageSize: getPageSize(),
    setData,
    setFilteredData,
    setLoading,
    setPage,
    setPageSize,
    fetchData,
    sortFilteredData,
  };
};
