import React from 'react';
import { get, isEqual, uniqBy } from 'lodash';
import ReactTable from 'react-table';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import TextInput from '@arranger/components/dist/Input';
import Tabs from '@arranger/components/dist/Tabs';
import { api } from '@arranger/components';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import searchStyles from 'theme/searchStyles';
import globals from 'utils/globals';
import tsvDownloader from 'utils/tsvDownloader';
import { Row, Col } from 'theme/system';

import FilterIcon from 'icons/FilterIcon';
import ExportIcon from 'icons/ExportIcon';
import SparkMeter from 'components/SparkMeter';

const VariantTable = ({ category, modelName, columns }) => (
  <Component
    initialState={{
      data: [],
      loading: false,
      filterValue: '',
      filteredData: [],
      page: 0,
      pageSize: 10,
    }}
    category={category}
    modelName={modelName}
    didMount={async ({ props: { fetchData }, setState }) => {
      await fetchData({ setState });
    }}
    shouldUpdate={({ props, nextProps, state, nextState }) => {
      return (
        props.category !== nextProps.category ||
        props.modelName !== nextProps.modelName ||
        !isEqual(state, nextState)
      );
    }}
    didUpdate={async ({
      props: { category, fetchData },
      setState,
      prevProps,
      prevState,
      state,
    }) => {
      if (category !== prevProps.category || modelName !== prevProps.modelName) {
        await fetchData({ setState });
      }
      if (state.filterValue !== prevState.filterValue) {
        const filteredData = state.data.filter(
          d =>
            Object.values(d)
              .filter(d => typeof d === 'string')
              .map(d => d.toLowerCase().includes(state.filterValue.toLowerCase()))
              .filter(v => v).length > 0,
        );

        setState({
          ...state,
          filteredData,
          pageSize: filteredData.lenth > 10 ? 10 : filteredData.length,
        });
      }
    }}
    fetchData={async ({ setState }) => {
      setState({ data: [], loading: true });
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
        .filter(node => node.category === category);

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
            <span>
              <Link
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
              {(get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0) * 100).toFixed(
                2,
              )}
              %
            </span>
          ),
          export: `${(
            get(freqs, d.name, 0) /
            get(freqsData, 'data.models.all.total', 0) *
            100
          ).toFixed(2)}%`,
        },
      }));
      setState({
        data: dataWithFreqs,
        loading: false,
        filteredData: dataWithFreqs,
        pageSize: dataWithFreqs.length > 10 ? 10 : dataWithFreqs.length,
        page: 0,
      });
      return data;
    }}
  >
    {({
      state,
      setState,
      props: { category },
      from = state.page * state.pageSize + 1,
      to = state.page * state.pageSize + state.pageSize,
    }) => (
      <Col>
        <Row className="toolbar" justifyContent="space-between">
          <div>
            {!state.loading &&
              `Showing ${from} - ${
                to <= state.filteredData.length ? to : state.filteredData.length
              } of
            ${state.filteredData.length} Variants`}
          </div>
          <Row justifyContent="flex-end">
            <TextInput
              icon={<FilterIcon height={10} width={10} fill={'#704A2C'} />}
              type="text"
              placeholder="Filter"
              value={state.filterValue}
              onChange={({ target: { value } }) => {
                setState({
                  ...state,
                  filterValue: value,
                });
              }}
            />
            <div
              className="pill"
              disabled={state.filteredData.length === 0}
              style={{ marginLeft: '10px' }}
              onClick={() =>
                tsvDownloader(
                  `${modelName}-${category}`,
                  state.filteredData,
                )
              }
            >
              <ExportIcon height={10} width={10} />
              TSV
            </div>
          </Row>
        </Row>
        <div css={searchStyles}>
          <ReactTable
            className="-striped"
            columns={columns}
            data={state.filteredData}
            loading={state.loading}
            showPagination={state.filteredData.length > 10}
            defaultPageSize={state.pageSize}
            minRows={state.pageSize}
            page={state.page}
            PaginationComponent={props => {
              setState({
                ...state,
                pageSize: props.pageSize,
                page: props.page,
              });
              return <CustomPagination {...props} maxPagesOptions={10} />;
            }}
            onPageChange={newPage => {
              setState({
                ...state,
                page: newPage,
              });
            }}
          />
        </div>
      </Col>
    )}
  </Component>
);

export default ({ modelName }) => (
  <Tabs
    tabs={[
      {
        title: <span>Clinical Sequencing</span>,
        key: 'clinical',
        content: (
          <VariantTable
            modelName={modelName}
            columns={[
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'name',
                id: 'variantName',
                accessor: 'name',
                Header: 'Name',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'genes',
                id: 'genes',
                accessor: 'genes',
                Header: 'Gene(s)',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'type',
                id: 'type',
                accessor: 'type',
                Header: 'Type',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'frequency',
                id: 'frequency',
                accessor: 'frequency.display',
                Header: 'Frequency',
              },
            ]}
            category="clinical_sequencing"
          />
        ),
      },
      {
        title: <span>Histopathological Biomarkers</span>,
        key: 'Histopathological',
        content: (
          <VariantTable
            modelName={modelName}
            category="histopathological_biomarker"
            columns={[
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'name',
                id: 'variantName',
                accessor: 'name',
                Header: 'Name',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'genes',
                id: 'genes',
                accessor: 'genes',
                Header: 'Gene(s)',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'assessment_type',
                id: 'assessmentType',
                accessor: 'assessment_type',
                Header: 'Assessment Type',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'expression_level',
                id: 'expression_level',
                accessor: 'expression_level',
                Header: 'Expression Level',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'frequency',
                id: 'frequency',
                accessor: 'frequency.display',
                Header: 'Frequency',
              },
            ]}
          />
        ),
      },
      {
        title: <span>Genomic Sequencing</span>,
        key: 'genomic',
        content: (
          <VariantTable
            modelName={modelName}
            category="genomic_sequencing"
            columns={[
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'name',
                id: 'variantName',
                accessor: 'name',
                Header: 'Name',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'genes',
                id: 'genes',
                accessor: 'genes',
                Header: 'Gene(s)',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'type',
                id: 'type',
                accessor: 'type',
                Header: 'Type',
              },
              {
                show: true,
                type: 'keyword',
                sortable: true,
                canChangeShow: true,
                field: 'frequency',
                id: 'frequency',
                accessor: 'frequency.display',
                Header: 'Frequency',
              },
            ]}
          />
        ),
      },
    ]}
  />
);
