import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactTable from 'react-table';

import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import Filter from 'components/input/Filter';
import TabGroup from 'components/layout/VerticalTabs';

import DownloadIcon from 'icons/DownloadIcon';
import VariantsIcon from 'icons/VariantsIcon';

import { useVariants } from 'providers/Variants';

import { ButtonPill } from 'theme/adminControlsStyles';
import searchStyles from 'theme/searchStyles';
import { Row, Col } from 'theme/system';
import { Tab, TabHeading, variantTab, variantTabActive } from 'theme/verticalTabStyles';
import { visuallyHidden } from 'theme';

import tsvDownloader from 'utils/tsvDownloader';

const VARIANT_TYPES = {
  clinical: 'clinical',
  histopathological: 'histopathological biomarker',
  genomic: 'genomic_sequencing',
};

const VariantTable = React.memo(({ type, modelName, columns }) => {
  const {
    data,
    filteredData,
    loading,
    page,
    pageSize,
    setData,
    setFilteredData,
    setLoading,
    setPage,
    setPageSize,
    fetchData,
    sortFilteredData,
  } = useVariants();
  const didMountRef = useRef(false);
  const [filterValue, setFilterValue] = useState('');

  const from = filteredData.length === 0 ? 0 : page * pageSize + 1;
  const to = page * pageSize + pageSize;
  const sortedData = useMemo(() => filteredData.slice().sort((a, b) => sortFilteredData(a, b)));

  useEffect(() => {
    const getData = async () => {
      setData([]);
      setLoading(true);

      const dataWithFreqs = await fetchData({ modelName, type });

      setData(dataWithFreqs);
      setFilteredData(dataWithFreqs);
      setLoading(false);
      setPage(0);
      setPageSize(10);
    };

    getData();
  }, [type, modelName]);

  useEffect(() => {
    // using a ref to mimic 'componentDidUpdate' behaviour (avoids running this on initial mount)
    if (didMountRef && didMountRef.current && data) {
      const newFilteredData = data.filter(
        d =>
          Object.values(d)
            .filter(d => typeof d === 'string')
            .map(d => d.toLowerCase().includes(filterValue.toLowerCase()))
            .filter(v => v).length > 0,
      );

      setFilteredData(newFilteredData);
      setPageSize(newFilteredData.length > 10 ? 10 : newFilteredData.length);
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
            <Filter onFilterValueChange={setFilterValue} />

            <ButtonPill
              secondary
              disabled={sortedData.length === 0}
              style={{ marginLeft: '8px' }}
              onClick={() => tsvDownloader(`${modelName}-${type}`, filteredData)}
            >
              <DownloadIcon height={12} width={12} fill={'#000'} />
              TSV
            </ButtonPill>
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
            style={{
              position: 'absolute',
              width: '100%',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: -1,
            }}
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
    case VARIANT_TYPES.clinical:
      return (
        <VariantTable
          modelName={modelName}
          type={VARIANT_TYPES.clinical}
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
    case VARIANT_TYPES.histopathological:
      return (
        <VariantTable
          modelName={modelName}
          type={VARIANT_TYPES.histopathological}
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
    case VARIANT_TYPES.genomic:
      return (
        <VariantTable
          modelName={modelName}
          type={VARIANT_TYPES.genomic}
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
  const [activeTab, setActiveTab] = useState(VARIANT_TYPES.clinical);
  const { fetchData } = useVariants();

  useEffect(() => {
    const checkClinicalVariants = async () => {
      const clinicalVariants = await fetchData({
        modelName,
        type: VARIANT_TYPES.clinical,
      });

      if (clinicalVariants.length > 0) {
        setActiveTab(VARIANT_TYPES.clinical);
      } else {
        setActiveTab(VARIANT_TYPES.histopathological);
      }
    };

    checkClinicalVariants();
  }, [modelName]);

  return (
    <Row
      css={`
        position: relative;
      `}
    >
      <TabGroup width={171}>
        <Tab
          active={activeTab === VARIANT_TYPES.clinical}
          onClick={() => setActiveTab(VARIANT_TYPES.clinical)}
        >
          <TabHeading css={activeTab === VARIANT_TYPES.clinical ? variantTabActive : variantTab}>
            Clinical Sequencing
          </TabHeading>
        </Tab>
        <Tab
          active={activeTab === VARIANT_TYPES.histopathological}
          onClick={() => setActiveTab(VARIANT_TYPES.histopathological)}
        >
          <TabHeading
            css={activeTab === VARIANT_TYPES.histopathological ? variantTabActive : variantTab}
          >
            Histopathological Biomarkers
          </TabHeading>
        </Tab>
        <Tab
          active={activeTab === VARIANT_TYPES.genomic}
          onClick={() => setActiveTab(VARIANT_TYPES.genomic)}
        >
          <TabHeading css={activeTab === VARIANT_TYPES.genomic ? variantTabActive : variantTab}>
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
