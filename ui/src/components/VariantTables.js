import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get, uniqBy } from 'lodash';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import { api } from '@arranger/components';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import SparkMeter from 'components/SparkMeter';
import TabGroup from 'components/layout/VerticalTabs';

import FilterIcon from 'icons/FilterIcon';
import DownloadIcon from 'icons/DownloadIcon';
import VariantsIcon from 'icons/VariantsIcon';

import searchStyles from 'theme/searchStyles';
import { Row, Col } from 'theme/system';
import { Tab, TabHeading, variantTab, variantTabActive } from 'theme/verticalTabStyles';
import { visuallyHidden } from 'theme';

import globals from 'utils/globals';
import tsvDownloader from 'utils/tsvDownloader';

const sortFilteredData = (a, b) => {
  if (!a || !a.frequency || !a.frequency.raw || !b || !b.frequency || !b.frequency.raw) {
    return false;
  }
  return b.frequency.raw - a.frequency.raw;
};

const VariantTable = React.memo(({ type, modelName, columns }) => {
  const didMountRef = useRef(false);

  const [filterValue, setFilterValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const from = page * pageSize + 1;
  const to = page * pageSize + pageSize;
  const sortedData = useMemo(() => filteredData.slice().sort((a, b) => sortFilteredData(a, b)));

  const fetchData = async () => {
    setData([]);
    setLoading(true);

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

    setData(dataWithFreqs);
    setLoading(false);
    setFilteredData(dataWithFreqs);
    setPageSize(10);
    setPage(0);

    return dataWithFreqs;
  };

  const getData = async () => {
    await fetchData();
  };

  useEffect(() => {
    getData();
  }, [type, modelName]);

  useEffect(() => {
    // using a ref to mimic 'componentDidUpdate' behaviour (avoids running this on initial mount)
    if (didMountRef.current && data) {
      const filteredData = data.filter(
        d =>
          Object.values(d)
            .filter(d => typeof d === 'string')
            .map(d => d.toLowerCase().includes(filterValue.toLowerCase()))
            .filter(v => v).length > 0,
      );

      setFilteredData(filteredData);
      setPageSize(filteredData.length > 10 ? 10 : filteredData.length);
    } else {
      didMountRef.current = true;
    }
  }, [filterValue]);

  return (
    <Col css={searchStyles}>
      {data && data.length > 0 ? (
        <Row className="toolbar" justifyContent="space-between">
          <div>
            {!loading &&
              `Showing ${from} - ${to <= sortedData.length ? to : sortedData.length} of
          ${sortedData.length} Variants`}
          </div>
          <Row justifyContent="flex-end">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
              className="inputWrapper"
            >
              <span className="inputIcon">
                <FilterIcon height={16} width={16} />
              </span>
              <input
                type="text"
                placeholder="Filter"
                value={filterValue}
                onChange={({ target: { value } }) => {
                  setFilterValue(value);
                }}
                style={{
                  border: 'none',
                  flex: 1,
                }}
              />
            </div>

            <button
              disabled={sortedData.length === 0}
              style={{ marginLeft: '8px' }}
              onClick={() => tsvDownloader(`${modelName}-${type}`, filteredData)}
            >
              <DownloadIcon height={12} width={12} fill={'#000'} />
              TSV
            </button>
          </Row>
        </Row>
      ) : null}
      <div css={searchStyles}>
        <ReactTable
          className="-striped"
          css={sortedData.length === 0 && visuallyHidden}
          data={sortedData}
          columns={columns}
          loading={loading}
          showPagination={sortedData.length > 10}
          defaultPageSize={pageSize}
          minRows={0}
          page={page}
          PaginationComponent={props => {
            setPageSize(props.pageSize);
            setPage(props.page);
            return <CustomPagination {...props} maxPagesOptions={10} />;
          }}
          onPageChange={newPage => setPage(newPage)}
        />
        {sortedData.length === 0 && (
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
        )}
      </div>
    </Col>
  );
});

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
              Header: 'Genes',
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
              Header: 'Genes',
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
              Header: 'Genes',
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
        <Tab active={activeTab === 'clinical'} onClick={() => setActiveTab('clinical')}>
          <TabHeading css={activeTab === 'clinical' ? variantTabActive : variantTab}>
            Clinical Sequencing
          </TabHeading>
        </Tab>
        <Tab
          active={activeTab === 'histopathological'}
          onClick={() => setActiveTab('histopathological')}
        >
          <TabHeading css={activeTab === 'histopathological' ? variantTabActive : variantTab}>
            Histopathological Biomarkers
          </TabHeading>
        </Tab>
        <Tab active={activeTab === 'genomic'} onClick={() => setActiveTab('genomic')}>
          <TabHeading css={activeTab === 'genomic' ? variantTabActive : variantTab}>
            Genomic Sequencing
          </TabHeading>
        </Tab>
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
