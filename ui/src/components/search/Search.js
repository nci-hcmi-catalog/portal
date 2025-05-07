import React from 'react';
import { css } from '@emotion/react';
import Component from 'react-component-component';
import SplitPane from 'react-split-pane';
import {
  Aggregations,
  Pagination,
  SQONViewer,
  Table,
  useArrangerTheme,
} from '@overture-stack/arranger-components';
import CountDisplay from '@overture-stack/arranger-components/dist/Table/CountDisplay/index';
import ColumnSelectButton from '@overture-stack/arranger-components/dist/Table/ColumnsSelectButton/index';
import DownloadButton from '@overture-stack/arranger-components/dist/Table/DownloadButton/index';
import { useDataContext } from '@overture-stack/arranger-components/dist/DataContext';

import { SelectedModelsContext } from 'providers/SelectedModels';

import ArrowIcon from 'icons/ArrowIcon';

import LastUpdatedDate from 'components/LastUpdatedDate';
import ExpandedToggle from 'components/search/ExpandedToggle';
import GeneSearch from 'components/search/GeneSearch';
import VariantSearch from 'components/search/VariantSearch';
import ModelSearch from 'components/search/ModelSearch';
import PrimarySiteChart from 'components/charts/PrimarySiteChart';
import MultipleModelsChart from 'components/charts/MultipleModelsChart';
import GrowthChart from 'components/charts/GrowthChart';
import TopVariantsChart from 'components/charts/TopVariantsChart';
import TableEntity from 'components/TableEntity';
import TableDistributorCell from 'components/TableDistributorCell';
import TableExpandedCell from 'components/TableExpandedCell';
import TableMatchedModelsCell from 'components/TableMatchedModelsCell';
import TableList from 'components/TableList';
import ShareButton from 'components/ShareButton';
import ModelList from 'components/ModelList';
import {
  MultipleModelsTooltip,
  MolecularCharacterizationsTooltip,
  ClinicalVariantsTooltip,
  HistopathologicalBiomarkersTooltip,
  GenomicVariantsTooltip,
  ExpansionStatusTooltip,
  MutatedGenesTooltip,
} from 'components/tooltips';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import { filterExpanded, toggleExpanded } from 'utils/sqonHelpers';

import searchStyles, { MainCol } from 'theme/searchStyles';
import { Row, Col } from 'theme/system';
import { useTable } from 'react-table';

// prevents facet tooltips from extending beyond the window
// approx. 20px for scrollbar width, plus 28px padding
const facetTooltipPadding = 48;
// non-searchable facets require less padding since they have no search button
const nonSearchableFacetTooltipPadding = facetTooltipPadding - 16;

let stable = true;

const getColumnTypes = ({ savedSetsContext, state, expandedSqon, history }) => ({
  name: {
    cellValue: (props) => (
      <TableEntity
        {...props}
        savedSetsContext={savedSetsContext}
        state={state}
        sqon={expandedSqon}
        history={history}
      />
    ),
  },
  chemotherapeutic_drugs: {
    cellValue: (props) => {
      const { value } = props;
      const { displayValues } = props.column;
      return displayValues[value] || value;
    },
  },
  distributor_part_number: {
    cellValue: (props) => <TableDistributorCell {...props} value={props.value} />,
  },
  expanded: {
    cellValue: (props) => <TableExpandedCell {...props} value={props.value} />,
    headerValue: () => (
      <Row justifyContent="space-between">
        Expansion Status <ExpansionStatusTooltip />
      </Row>
    ),
  },
  matched_models_list: {
    cellValue: (props) => (
      <TableMatchedModelsCell
        {...props}
        value={props.value}
        savedSetsContext={savedSetsContext}
        state={state}
        sqon={expandedSqon}
        history={history}
      />
    ),
    headerValue: () => (
      <Row justifyContent="space-between">
        Has Multiple Models <MultipleModelsTooltip isColumn={true} />
      </Row>
    ),
  },
  licensing_required: {
    cellValue: (props) => {
      const { value } = props;
      const { displayValues } = props.column;
      return displayValues[value] || value;
    },
  },
  list: { cellValue: (props) => <TableList {...props} /> },
  molecular_characterizations: {
    headerValue: () => (
      <Row justifyContent="space-between">
        Available Molecular Characterizations
        <MolecularCharacterizationsTooltip isColumn={true} />
      </Row>
    ),
  },
  'gene_metadata.mutated_genes_count': {
    headerValue: () => (
      <Row justifyContent="space-between">
        # Mutated Genes
        <MutatedGenesTooltip />
      </Row>
    ),
  },
  'gene_metadata.genomic_variant_count': {
    headerValue: () => (
      <Row justifyContent="space-between">
        # Research Somatic Variants
        <GenomicVariantsTooltip />
      </Row>
    ),
  },
  'gene_metadata.clinical_variant_count': {
    headerValue: () => (
      <Row justifyContent="space-between">
        # Clinical Variants
        <ClinicalVariantsTooltip />
      </Row>
    ),
  },
  'gene_metadata.histopathological_variant_count': {
    headerValue: () => (
      <Row justifyContent="space-between">
        # Histo-pathological Biomarkers
        <HistopathologicalBiomarkersTooltip />
      </Row>
    ),
  },
});

const Search = ({ setState, state, savedSetsContext, history, ...props }) => {
  const { showUnexpanded } = useExpandedUnexpanded();
  const context = useDataContext({ callerName: 'HCMISearch' });
  const { setSQON, sqon } = context;
  const expandedSqon = toggleExpanded(sqon, showUnexpanded);
  const columnTypes = getColumnTypes({ savedSetsContext, state, expandedSqon, history });
  const filteredSqon = filterExpanded(sqon);
  const theme = useArrangerTheme({
    components: {
      Table: {
        columnTypes,
      },
    },
  });

  return (
    <Col css={searchStyles}>
      <SplitPane
        className="search-split-pane"
        split="vertical"
        minSize={50}
        defaultSize={state?.panelSize}
        onChange={(panelSize) => {
          setState({ panelSize });
        }}
        onDragStarted={() => (stable = false)}
        onDragFinished={() => (stable = true)}
      >
        <Col className="aggregations-wrapper" role="complementary">
          <Component>
            {() => (
              <>
                <ModelSearch sqon={expandedSqon} setSQON={setSQON} />
                <GeneSearch
                  sqon={expandedSqon}
                  setSQON={setSQON}
                  tooltipWidth={state?.panelSize - facetTooltipPadding}
                />
                <VariantSearch sqon={expandedSqon} setSQON={setSQON} />
                <Aggregations
                  customFacets={[
                    {
                      content: {
                        fieldName: 'genomic_variants.classification',
                        displayName: (
                          <Row justifyContent="space-between">
                            Research Somatic Variant Type
                            <GenomicVariantsTooltip
                              isFacet={true}
                              width={state.panelSize - facetTooltipPadding}
                            />
                          </Row>
                        ),
                      },
                    },
                    {
                      content: {
                        fieldName: 'type',
                        displayName: 'Model Type',
                      },
                    },
                    {
                      content: {
                        fieldName: 'has_matched_models',
                        displayName: (
                          <Row justifyContent="space-between">
                            Has Multiple Models
                            <MultipleModelsTooltip
                              isFacet={true}
                              width={state.panelSize - nonSearchableFacetTooltipPadding}
                            />
                          </Row>
                        ),
                      },
                    },
                    {
                      content: {
                        fieldName: 'molecular_characterizations',
                        displayName: (
                          <Row justifyContent="space-between">
                            Available Molecular Characterizations
                            <MolecularCharacterizationsTooltip
                              isFacet={true}
                              width={state.panelSize - facetTooltipPadding}
                            />
                          </Row>
                        ),
                      },
                    },
                  ]}
                />
                {/* TODO: Review componentProps
                <Aggregations
                    componentProps={{
                      getTermAggProps: () => ({ maxTerms: 4 }),
                    }}
                  /> */}
              </>
            )}
          </Component>
        </Col>
        <MainCol
          id="main"
          className="search-results-wrapper"
          p={30}
          flex={1}
          css={css`
            width: calc(100vw - ${state.panelSize}px);
            overflow-y: scroll !important;
          `}
        >
          <Row
            css={css`
              background-color: #f6f6f8;
              border: 1px solid #d9d9df;
              align-items: center;
              min-height: 50px;
            `}
          >
            {!filterExpanded(sqon) && (
              <Row
                css={css`
                  padding: 0 14px;
                  flex: 1;
                `}
              >
                <span className="sqon-field no-sqon-message">
                  <ArrowIcon
                    css={css`
                      transform: rotate(180deg);
                    `}
                  />
                  Use the filter panel on the left to customize your model search.
                </span>
              </Row>
            )}
            <SQONViewer
              displayName="SearchSQON"
              {...props}
              sqon={filterExpanded(sqon)}
              setSQON={setSQON}
              index={props.index}
              graphqlField={props.index}
            />
            <div className="search-header-actions">
              <ShareButton link={`${window.location.origin}/`} quote={`HCMI Search`} />
              <ModelList className="search-header-model-list" />
            </div>
          </Row>
          <Row
            bg="white"
            css={css`
              margin: 8px 0;
              justify-content: space-around;
              border: 1px solid #d9d9df;
            `}
            aria-hidden={true}
          >
            <Component shouldUpdate={() => stable}>
              {() => (
                <>
                  <PrimarySiteChart sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                  <MultipleModelsChart
                    sqon={toggleExpanded(sqon, showUnexpanded)}
                    setSQON={setSQON}
                  />
                  <GrowthChart sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                  <TopVariantsChart sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                </>
              )}
            </Component>
          </Row>
          <Component shouldUpdate={() => stable}>
            {() => (
              <SelectedModelsContext.Consumer>
                {(selectedModelContext) => {
                  // Options for Export drop down
                  const exporterOptions = [
                    {
                      label: 'TSV (current columns)',
                      function: 'saveTSV',
                    },
                    {
                      label: 'TSV (all columns)',
                      function: 'saveTSV',
                      columns: [],
                    },
                  ];
                  if (selectedModelContext?.state?.modelIds.length > 0) {
                    exporterOptions.unshift({
                      label: (
                        <div className="selectedModelsLabel">
                          ({selectedModelContext?.state?.modelIds.length} models selected)
                        </div>
                      ),
                    });
                  }
                  return (
                    <>
                      {/* TODO: Placeholder for Toolbar requiring Arranger/Node update  */}
                      <Row>
                        <CountDisplay />
                        <ExpandedToggle sqon={filteredSqon} />
                        <ColumnSelectButton />
                        <DownloadButton theme={{ customExporters: exporterOptions }} />
                      </Row>
                      <Table />
                      <Pagination />
                    </>
                    // Old Table Props
                    // {...props}
                    // {...tableContext}
                    // showFilterInput={false}
                    // setSelectedTableRows={(selectedRows) =>
                    //   selectedModelContext?.setModels(selectedRows)
                    // }
                    // selectedRows={
                    //   selectedModelContext?.state?.modelIds || tableContext.selectedRows
                    // }
                    // isLoading={
                    //   savedSetsContext?.state?.loading ||
                    //   tableContext.loading ||
                    //   props.loading
                    // }
                    // onSortedChange={(sorted) => setState({ sorted })}
                    // customTypeConfigs={{
                    //   entity: {
                    //     minWidth: 140,
                    //   },
                    //   list: {
                    //     minWidth: 160,
                    //   },
                    //   age_at_sample_acquisition: { minWidth: 85 },
                    //   mutated_genes_count: { minWidth: 88 },
                    //   number: { minWidth: 88 },
                    //   expanded: { minWidth: 105 },
                    //   histo_variant_count: { minWidth: 108 },
                    //   matched_models: { minWidth: 84 },
                    // }}
                    // index={props.index}
                    // graphqlField={props.index}
                    // columnDropdownText="Columns"
                    // enableSelectedTableRowsExporterFilter={true}
                    // selectedRowsFilterPropertyName="_id"
                    // exporterLabel="Export"
                    // transformParams={(params) => ({
                    //   ...params,
                    //   url: `${globals.ARRANGER_API}/export/models`,
                    // })}
                    // fieldTypesForFilter={['text', 'keyword', 'id']}
                    // enableDropDownControls={true}
                    // sessionStorage={true}
                    // storageKey={selectedModelContext?.storageKey}
                  );
                }}
              </SelectedModelsContext.Consumer>
            )}
          </Component>
          <LastUpdatedDate />
        </MainCol>
      </SplitPane>
    </Col>
  );
};

export default Search;
