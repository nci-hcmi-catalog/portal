import { useEffect, useReducer, useState } from 'react';
import Component from 'react-component-component';
import SplitPane from 'react-split-pane';
import { isEqual } from 'lodash';
import { css } from '@emotion/react';
import {
  Aggregations,
  Pagination,
  SQONViewer,
  Table,
  useArrangerData,
  useArrangerTheme,
  useTableContext,
} from '@overture-stack/arranger-components';
import CountDisplay from '@overture-stack/arranger-components/dist/Table/CountDisplay/index';
import ColumnSelectButton from '@overture-stack/arranger-components/dist/Table/ColumnsSelectButton/index';
import DownloadButton from '@overture-stack/arranger-components/dist/Table/DownloadButton/index';

import ArrowIcon from '~/icons/ArrowIcon';
import DownloadIcon from '~/icons/DownloadIcon';
import { SelectedModelsContext } from '~/providers/SelectedModels';
import cartDownload from '~/utils/cartDownload';
import searchStyles, { MainCol } from '~/theme/searchStyles';
import { Row, Col } from '~/theme/system';

import LastUpdatedDate from '../LastUpdatedDate';
import PrimarySiteChart from '../charts/PrimarySiteChart.jsx';
import MultipleModelsChart from '../charts/MultipleModelsChart';
import GrowthChart from '../charts/GrowthChart';
import TopVariantsChart from '../charts/TopVariantsChart';
import TableEntity from '../TableEntity';
import TableDistributorCell from '../TableDistributorCell';
import TableExpandedCell from '../TableExpandedCell';
import TableMatchedModelsCell from '../TableMatchedModelsCell';
import TableList from '../TableList';
import ShareButton from '../ShareButton';
import ModelList from '../ModelList';
import {
  MultipleModelsTooltip,
  MolecularCharacterizationsTooltip,
  ClinicalVariantsTooltip,
  HistopathologicalBiomarkersTooltip,
  GenomicVariantsTooltip,
  ExpansionStatusTooltip,
  MutatedGenesTooltip,
} from '../tooltips';

import ExpandedToggle from './ExpandedToggle';
import GeneSearch from './GeneSearch';
import VariantSearch from './VariantSearch';
import ModelSearch from './ModelSearch';

// prevents facet tooltips from extending beyond the window
// approx. 20px for scrollbar width, plus 28px padding
const facetTooltipPadding = 48;
// non-searchable facets require less padding since they have no search button
const nonSearchableFacetTooltipPadding = facetTooltipPadding - 16;

let stable = true;

const getColumnTypes = ({ savedSetsContext, sqon, history }) => ({
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
  has_matched_models: {
    size: 84,
    cellValue: (props) => (
      <TableMatchedModelsCell {...props} savedSetsContext={savedSetsContext} history={history} />
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
      <TableEntity {...props} savedSetsContext={savedSetsContext} sqon={sqon} history={history} />
    ),
  },
  number: { size: 88 },
});

const Search = ({
  setState: searchWrapperSetState,
  state: tableState,
  savedSetsContext,
  history,
  urlSqon,
  setUrlSQON,
  ...props
}) => {
  const context = useArrangerData({
    callerName: 'HCMISearch',
  });
  const { apiFetcher, extendedMapping, sqon, setSQON } = context;
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setSQON(urlSqon);
      setFirstRender(false);
    } else {
      if (!isEqual(sqon, urlSqon)) {
        setUrlSQON(sqon);
      }
    }
  }, [sqon, setSQON, urlSqon, firstRender, setUrlSQON]);

  const columnTypes = getColumnTypes({
    savedSetsContext,
    sqon,
    history,
  });

  useArrangerTheme({
    components: {
      Aggregations: {
        TreeJointIcon: { Icon: () => <ArrowIcon fill={'#900000'} width={'9px'} height={'9px'} /> },
      },
      SQONViewer: {
        SQONWrapper: {
          css: css`
            align-items: baseline;
          `,
        },
        EmptyMessage: {
          arrowColor: '#CD0D32',
        },
      },
      Table: {
        columnTypes,
        DownloadButton: {
          label: () => (
            <span>
              <DownloadIcon />
              Export
            </span>
          ),
        },
      },
    },
  });

  const tableContext = useTableContext({ callerName: 'SearchTable' });

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
        defaultSize={tableState.panelSize}
        onChange={(panelSize) => {
          searchWrapperSetState({ panelSize });
        }}
        onDragStarted={() => (stable = false)}
        onDragFinished={() => (stable = true)}
      >
        <Col className="aggregations-wrapper" role="complementary">
          <Component>
            <>
              <ModelSearch sqon={sqon} setSQON={setSQON} />
              <GeneSearch
                sqon={sqon}
                setSQON={setSQON}
                tooltipWidth={tableState.panelSize - facetTooltipPadding}
              />
              <VariantSearch sqon={sqon} setSQON={setSQON} />
              <Aggregations
                {...props}
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
            <SQONViewer
              {...props}
              emptyMessage={'Use the filter panel on the left to customize your model search.'}
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
                  <PrimarySiteChart sqon={sqon} setSQON={setSQON} />
                  <MultipleModelsChart
                    sqon={sqon}
                    setSQON={setSQON}
                    extendedMapping={extendedMapping}
                  />
                  <GrowthChart sqon={sqon} setSQON={setSQON} />
                  <TopVariantsChart sqon={sqon} setSQON={setSQON} />
                </>
              )}
            </Component>
          </Row>
          <Component shouldUpdate={() => stable}>
            {() => (
              <SelectedModelsContext.Consumer>
                {(selectedModelContext) => {
                  // Options for Export drop down
                  const { visibleColumnsDict } = tableContext;
                  const currentColumns = Object.values(visibleColumnsDict);
                  const customExporters = [
                    {
                      label: 'TSV (current columns)',
                      function: () =>
                        cartDownload(
                          selectedModelContext?.state?.modelIds,
                          apiFetcher,
                          sqon,
                          currentColumns,
                        ),
                    },
                    {
                      label: 'TSV (all columns)',
                      function: () =>
                        cartDownload(selectedModelContext?.state?.modelIds, apiFetcher, sqon),
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
                        <ExpandedToggle sqon={sqon} apiFetcher={apiFetcher} />
                        <div className="group">
                          <ColumnSelectButton />
                          <DownloadButton
                            theme={{
                              customExporters,
                            }}
                          />
                        </div>
                      </Row>
                      <Table {...props} />
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

export default Search;
