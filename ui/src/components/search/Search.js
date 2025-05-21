import React, { useEffect, useReducer } from 'react';
import Component from 'react-component-component';
import SplitPane from 'react-split-pane';
import { css } from '@emotion/react';
import {
  Aggregations,
  Pagination,
  SQONViewer,
  Table,
  useArrangerData,
  useArrangerTheme,
} from '@overture-stack/arranger-components';
import CountDisplay from '@overture-stack/arranger-components/dist/Table/CountDisplay/index';
import ColumnSelectButton from '@overture-stack/arranger-components/dist/Table/ColumnsSelectButton/index';
import DownloadButton from '@overture-stack/arranger-components/dist/Table/DownloadButton/index';

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
import { SelectedModelsContext } from 'providers/SelectedModels';

import { toggleExpanded } from 'utils/sqonHelpers';

import searchStyles, { MainCol } from 'theme/searchStyles';
import { Row, Col } from 'theme/system';

// prevents facet tooltips from extending beyond the window
// approx. 20px for scrollbar width, plus 28px padding
const facetTooltipPadding = 48;
// non-searchable facets require less padding since they have no search button
const nonSearchableFacetTooltipPadding = facetTooltipPadding - 16;

let stable = true;

const getColumnTypes = ({ savedSetsContext, tableState, expandedSqon, history }) => ({
  age_at_sample_acquisition: { size: 85 },
  chemotherapeutic_drugs: {
    cellValue: (props) => {
      const { value } = props;
      const { displayValues } = props.column;
      return displayValues[value] || value;
    },
  },
  distributor_part_number: {
    cellValue: (props) => <TableDistributorCell {...props} />,
  },
  expanded: {
    size: 105,
    cellValue: (props) => <TableExpandedCell {...props} value={props.value} />,
    headerValue: () => (
      <Row justifyContent="space-between">
        Expansion Status <ExpansionStatusTooltip />
      </Row>
    ),
  },
  'gene_metadata.mutated_genes_count': {
    size: 88,
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
    size: 108,
    headerValue: () => (
      <Row justifyContent="space-between">
        # Histo-pathological Biomarkers
        <HistopathologicalBiomarkersTooltip />
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
  list: { size: 160, cellValue: (props) => <TableList {...props} /> },
  matched_models_list: {
    size: 84,
    cellValue: (props) => (
      <TableMatchedModelsCell
        {...props}
        value={props.value}
        savedSetsContext={savedSetsContext}
        state={tableState}
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
  molecular_characterizations: {
    headerValue: () => (
      <Row justifyContent="space-between">
        Available Molecular Characterizations
        <MolecularCharacterizationsTooltip isColumn={true} />
      </Row>
    ),
  },
  name: {
    size: 150,
    cellValue: (props) => (
      <TableEntity
        {...props}
        savedSetsContext={savedSetsContext}
        expandedSqon={expandedSqon}
        tableState={tableState}
        history={history}
      />
    ),
  },
  number: { size: 88 },
});

const defaultSqon = {
  content: [
    {
      content: {
        fieldName: 'expanded',
        value: ['true'],
      },
      op: 'in',
    },
  ],
  op: 'and',
};

const Search = ({
  setState: searchWrapperSetState,
  state: tableState,
  savedSetsContext,
  history,
  ...props
}) => {
  const context = useArrangerData({
    callerName: 'HCMISearch',
  });
  const { apiFetcher, extendedMapping, setSQON, sqon } = context;
  const { showUnexpanded } = useExpandedUnexpanded();
  const expandedSqon = toggleExpanded(sqon, showUnexpanded);

  const isDefaultSqon =
    sqon?.op === defaultSqon.op &&
    sqon?.content.length === 1 &&
    sqon?.content[0].content.fieldName === 'expanded' &&
    sqon?.content[0].content.value[0] === 'true';

  useEffect(() => {
    if (!sqon) {
      setSQON(defaultSqon);
    }
  }, [sqon, setSQON, showUnexpanded]);

  const columnTypes = getColumnTypes({ savedSetsContext, tableState, expandedSqon, history });
  useArrangerTheme({
    components: {
      Table: {
        columnTypes,
      },
      SQONViewer: {
        EmptyMessage: {
          arrowColor: '#ffffff',
        },
      },
    },
  });

  // Force Aggregations re-render on page reload
  // https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    forceUpdate();
  }, []);

  return (
    <Col css={searchStyles}>
      <SplitPane
        className="search-split-pane"
        split="vertical"
        minSize={50}
        defaultSize={tableState?.panelSize}
        onChange={(panelSize) => {
          searchWrapperSetState({ panelSize });
        }}
        onDragStarted={() => (stable = false)}
        onDragFinished={() => (stable = true)}
      >
        <Col className="aggregations-wrapper" role="complementary">
          <Component>
            <>
              <ModelSearch sqon={expandedSqon} setSQON={setSQON} />
              <GeneSearch
                sqon={expandedSqon}
                setSQON={setSQON}
                tooltipWidth={tableState?.panelSize - facetTooltipPadding}
              />
              <VariantSearch sqon={expandedSqon} setSQON={setSQON} />
              <Aggregations
                // Bug related to Facets not reloading on navigation
                isLoading={ignored}
                componentProps={{
                  getTermAggProps: () => ({ maxTerms: 4 }),
                }}
                customFacets={[
                  {
                    content: {
                      fieldName: 'genomic_variants.classification',
                      displayName: (
                        <Row justifyContent="space-between">
                          Research Somatic Variant Type
                          <GenomicVariantsTooltip
                            isFacet={true}
                            width={tableState.panelSize - facetTooltipPadding}
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
                            width={tableState.panelSize - nonSearchableFacetTooltipPadding}
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
                            width={tableState.panelSize - facetTooltipPadding}
                          />
                        </Row>
                      ),
                    },
                  },
                ]}
              />
            </>
          </Component>
        </Col>
        <MainCol
          id="main"
          className="search-results-wrapper"
          p={30}
          flex={1}
          css={css`
            width: calc(100vw - ${tableState.panelSize}px);
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
            {isDefaultSqon && (
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
            <SQONViewer emptyMessage={''} setSQON={setSQON} />
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
                  <PrimarySiteChart sqon={expandedSqon} setSQON={setSQON} />
                  <MultipleModelsChart
                    sqon={expandedSqon}
                    setSQON={setSQON}
                    extendedMapping={extendedMapping}
                  />
                  <GrowthChart sqon={expandedSqon} setSQON={setSQON} />
                  <TopVariantsChart sqon={expandedSqon} setSQON={setSQON} />
                </>
              )}
            </Component>
          </Row>
          <Component shouldUpdate={() => stable}>
            {() => (
              <SelectedModelsContext.Consumer>
                {(selectedModelContext) => {
                  // Options for Export drop down
                  const customExporters = [
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
                    customExporters.unshift({
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
                      <Row className="tableToolbar">
                        <CountDisplay />
                        <ExpandedToggle sqon={sqon} setSQON={setSQON} apiFetcher={apiFetcher} />
                        <div className="group">
                          <ColumnSelectButton />
                          <DownloadButton theme={{ customExporters }} />
                        </div>
                      </Row>
                      <Table />
                      <div className={'pagination-bottom'}>
                        <Pagination />
                        <LastUpdatedDate />
                      </div>
                    </>
                  );
                }}
              </SelectedModelsContext.Consumer>
            )}
          </Component>
        </MainCol>
      </SplitPane>
    </Col>
  );
};

// Old Table Props
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
// storageKey={selectedModelContext?.storageKey}};

export default Search;
