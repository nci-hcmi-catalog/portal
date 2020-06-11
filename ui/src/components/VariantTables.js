import React, { useState } from 'react';
import { get, isEqual, uniqBy } from 'lodash';
import ReactTable from 'react-table';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import TextInput from '@arranger/components/dist/Input';
import { api } from '@arranger/components';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import SparkMeter from 'components/SparkMeter';
import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';

import FilterIcon from 'icons/FilterIcon';
import ExportIcon from 'icons/ExportIcon';
import VariantsIcon from 'icons/VariantsIcon';

import searchStyles from 'theme/searchStyles';
import { Row, Col } from 'theme/system';

import globals from 'utils/globals';
import tsvDownloader from 'utils/tsvDownloader';

const VariantTable = ({ type, modelName, columns }) => (
  <Component
    initialState={{
      data: [],
      loading: false,
      filterValue: '',
      filteredData: [],
      page: 0,
      pageSize: 10,
    }}
    type={type}
    modelName={modelName}
    didMount={async ({ props: { fetchData }, setState }) => {
      await fetchData({ setState });
    }}
    shouldUpdate={({ props, nextProps, state, nextState }) => {
      return (
        props.type !== nextProps.type ||
        props.modelName !== nextProps.modelName ||
        !isEqual(state, nextState)
      );
    }}
    didUpdate={async ({ props: { type, fetchData }, setState, prevProps, prevState, state }) => {
      if (type !== prevProps.type || modelName !== prevProps.modelName) {
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
              {(get(freqs, d.name, 0) / get(freqsData, 'data.models.all.total', 0) * 100).toFixed(
                2,
              )}
              %
            </div>
          ),
          export: `${(
            get(freqs, d.name, 0) /
            get(freqsData, 'data.models.all.total', 0) *
            100
          ).toFixed(2)}%`,
          raw: get(freqs, d.name, 0),
        },
      }));
      setState({
        data: dataWithFreqs,
        loading: false,
        filteredData: dataWithFreqs,
        pageSize: 10,
        page: 0,
      });
      return dataWithFreqs;
    }}
  >
    {({
      state,
      setState,
      props: { type },
      from = state.page * state.pageSize + 1,
      to = state.page * state.pageSize + state.pageSize,
      sortedData = state.filteredData.slice().sort((a, b) => b.frequency.raw - a.frequency.raw),
    }) =>
      sortedData.length === 0 ? (
        <div
          className="model-details model-details--empty"
          css={`
            position: absolute;
            width: 100%;
            left: 0;
            z-index: -1;
          `}
        >
          <VariantsIcon fill={'#b2b7c1'} height={30} width={30} />
          <p className="model-details__empty-message">No variants available.</p>
        </div>
      ) : (
        <Col>
          <Row className="toolbar" justifyContent="space-between">
            <div>
              {!state.loading &&
                `Showing ${from} - ${to <= sortedData.length ? to : sortedData.length} of
            ${sortedData.length} Variants`}
            </div>
            <Row justifyContent="flex-end">
              <TextInput
                icon={<FilterIcon height={10} width={10} css={'margin: 0 0 0 5px;'} />}
                type="text"
                placeholder="Filter"
                value={state.filterValue}
                onChange={({ target: { value } }) => {
                  setState({
                    filterValue: value,
                  });
                }}
              />
              <button
                className="pill"
                disabled={sortedData.length === 0}
                style={{ marginLeft: '10px' }}
                onClick={() => tsvDownloader(`${modelName}-${type}`, state.filteredData)}
              >
                <ExportIcon height={10} width={10} />
                TSV
              </button>
            </Row>
          </Row>
          <div css={searchStyles}>
            <ReactTable
              className="-striped"
              data={sortedData}
              columns={columns}
              loading={state.loading}
              showPagination={sortedData.length > 10}
              defaultPageSize={state.pageSize}
              minRows={0}
              page={state.page}
              PaginationComponent={props => {
                setState({
                  pageSize: props.pageSize,
                  page: props.page,
                });
                return <CustomPagination {...props} maxPagesOptions={10} />;
              }}
              onPageChange={newPage => {
                setState({
                  page: newPage,
                });
              }}
            />
          </div>
        </Col>
      )
    }
  </Component>
);

const renderTable = (activeTab, modelName) => {
  switch (activeTab) {
    case 'clinical':
      return (
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
              field: 'category',
              id: 'category',
              accessor: 'category',
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
          type="clinical"
        />
      );
    case 'histopathological':
      return (
        <VariantTable
          modelName={modelName}
          type="histopathological biomarker"
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
              id: 'assessment_type',
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
      );
    case 'genomic':
      return (
        <VariantTable
          modelName={modelName}
          type="genomic_sequencing"
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
              field: 'category',
              id: 'category',
              accessor: 'category',
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
      );
    default:
      return null;
  }
};

export default ({ modelName }) => {
  const [activeTab, setActiveTab] = useState('clinical');
  return (
    <Row
      css={`
        position: relative;
      `}
    >
      <TabGroup width={171}>
        <Tab
          active={activeTab === 'clinical'}
          heading={'Clinical Sequencing'}
          onClick={() => setActiveTab('clinical')}
        />
        <Tab
          active={activeTab === 'histopathological'}
          heading={'Histopathological Biomarkers'}
          onClick={() => setActiveTab('histopathological')}
        />
        <Tab
          active={activeTab === 'genomic'}
          heading={'Genomic Sequencing'}
          onClick={() => setActiveTab('genomic')}
        />
      </TabGroup>
      <div
        css={`
          width: calc(100% - 171px);
          padding-left: 18px;
        `}
      >
        {renderTable(activeTab, modelName)}
      </div>
    </Row>
  );
};
