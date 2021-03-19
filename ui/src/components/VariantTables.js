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

import { VARIANT_TYPES } from 'utils/constants';
import tsvDownloader from 'utils/tsvDownloader';

const generateTsvFilename = (modelName, type) => {
  switch (type) {
    case VARIANT_TYPES.clinical:
      return `${modelName}-clinical-variants`;
    case VARIANT_TYPES.histopathological:
      return `${modelName}-histopathological-biomarkers`;
    case VARIANT_TYPES.genomic:
      return `${modelName}-research-somatic-variants`;
    default:
      return `${modelName}-variants`;
  }
};

const VariantTable = React.memo(({ type, modelName, columns, storageKey }) => {
  const {
    data,
    geneMetadata,
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
  const didFetchRef = useRef(false);
  const didMountRef = useRef(false);
  const [filterValue, setFilterValue] = useState('');

  const from = filteredData.length === 0 ? 0 : page * pageSize + 1;
  const to = page * pageSize + pageSize;
  const sortedData = useMemo(() => filteredData.slice().sort((a, b) => sortFilteredData(a, b)));

  const pageSizeStorageKey = `varianttable-${storageKey}-pagesize`;
  const pageSizeChangeHandler = size => {
    if (storageKey) {
      window.sessionStorage.setItem(pageSizeStorageKey, size);
    }
    setPageSize(size);
  };
  const pageSizeFromStorage = () => {
    return storageKey ? parseInt(window.sessionStorage.getItem(pageSizeStorageKey)) : undefined;
  };

  useEffect(() => {
    // avoid fetching data twice on page load
    const getData = async () => {
      if (didFetchRef && didFetchRef.current) {
        setData([]);
        setLoading(true);

        const dataWithFreqs = await fetchData({ modelName, type });

        setData(dataWithFreqs);
        setFilteredData(dataWithFreqs);
        setLoading(false);
      } else {
        didFetchRef.current = true;
      }

      setPage(0);
      setPageSize(pageSizeFromStorage() || 20);
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
              onClick={() => tsvDownloader(generateTsvFilename(modelName, type), filteredData)}
            >
              <DownloadIcon height={'12px'} width={'12px'} />
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
          pageSize={pageSize}
          minRows={0}
          page={page}
          PaginationComponent={props => {
            setPageSize(props.pageSize);
            setPage(props.page);
            return (
              <CustomPagination
                {...props}
                pageSize={pageSize}
                onPageSizeChange={pageSizeChangeHandler}
                maxPagesOptions={10}
              />
            );
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
            <VariantsIcon />
            <p className="model-details__empty-message">
              {loading
                ? 'Loading...'
                : type === VARIANT_TYPES.genomic && geneMetadata && geneMetadata.filename
                ? 'No variants were identified in the Masked Somatic MAF file.'
                : 'No variants available.'}
            </p>
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
          storageKey="model-variants-clinical"
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
          storageKey="model-variants-histo"
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
          storageKey="model-variants-genomic"
          columns={[
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'variant_id',
              id: 'variant_id',
              accessor: 'variant_id',
              Header: 'Variant',
            },
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'gene',
              id: 'gene',
              accessor: 'gene.display',
              sortMethod: (a, b) => {
                const gene1 = typeof a === 'string' ? a : a.props.children;
                const gene2 = typeof b === 'string' ? b : b.props.children;

                if (gene1.toLowerCase() < gene2.toLowerCase()) return -1;
                if (gene1.toLowerCase() > gene2.toLowerCase()) return 1;
                return 0;
              },
              Header: 'Gene',
            },
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'aa_change',
              id: 'aa_change',
              accessor: 'aa_change',
              Header: 'AA Change',
            },
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'transcript_id',
              id: 'transcript_id',
              accessor: 'transcript_id',
              Header: 'Transcript',
            },
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'consequence_type',
              id: 'consequence_type',
              accessor: 'consequence_type',
              Header: 'Consequence',
            },
            {
              show: true,
              type: 'keyword',
              sortable: true,
              canChangeShow: true,
              field: 'class',
              id: 'class',
              accessor: 'class',
              Header: 'Class',
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
          ]}
        />
      );
    default:
      return null;
  }
};

export default ({ modelName }) => {
  const [activeTab, setActiveTab] = useState(VARIANT_TYPES.clinical);
  const [isEmpty, setIsEmpty] = useState(true);
  const { fetchData, fetchGeneMetadata, setData, setFilteredData } = useVariants();

  useEffect(() => {
    const checkClinicalVariants = async () => {
      const clinicalVariants = await fetchData({
        modelName,
        type: VARIANT_TYPES.clinical,
      });
      const genomicVariants = await fetchData({
        modelName,
        type: VARIANT_TYPES.genomic,
      });
      const histopathologicalBiomarkers = await fetchData({
        modelName,
        type: VARIANT_TYPES.histopathological,
      });
      const geneMetadata = await fetchGeneMetadata(modelName);

      if (
        clinicalVariants.length === 0 &&
        genomicVariants.length === 0 &&
        histopathologicalBiomarkers.length === 0 &&
        !geneMetadata.filename
      ) {
        setIsEmpty(true);
      } else if (genomicVariants.length > 0 || (geneMetadata && geneMetadata.filename)) {
        setIsEmpty(false);
        setActiveTab(VARIANT_TYPES.genomic);
        setData(genomicVariants);
        setFilteredData(genomicVariants);
      } else if (clinicalVariants.length > 0) {
        setIsEmpty(false);
        setActiveTab(VARIANT_TYPES.clinical);
        setData(clinicalVariants);
        setFilteredData(clinicalVariants);
      } else {
        setIsEmpty(false);
        setActiveTab(VARIANT_TYPES.histopathological);
        setData(histopathologicalBiomarkers);
        setFilteredData(histopathologicalBiomarkers);
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
      {isEmpty ? (
        <div
          className="model-details model-details--empty"
          style={{
            width: '100%',
          }}
        >
          <VariantsIcon />
          <p className="model-details__empty-message">No variants available.</p>
        </div>
      ) : (
        <>
          <TabGroup width={175}>
            <Tab
              active={activeTab === VARIANT_TYPES.genomic}
              onClick={() => setActiveTab(VARIANT_TYPES.genomic)}
            >
              <TabHeading css={activeTab === VARIANT_TYPES.genomic ? variantTabActive : variantTab}>
                Research Somatic Variants
              </TabHeading>
            </Tab>
            <Tab
              active={activeTab === VARIANT_TYPES.clinical}
              onClick={() => setActiveTab(VARIANT_TYPES.clinical)}
            >
              <TabHeading
                css={activeTab === VARIANT_TYPES.clinical ? variantTabActive : variantTab}
              >
                Clinical Variants
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
          </TabGroup>
          <div
            css={`
              width: calc(100% - 175px);
              padding-left: 18px;
            `}
          >
            {renderTable(activeTab, modelName)}
          </div>
        </>
      )}
    </Row>
  );
};
