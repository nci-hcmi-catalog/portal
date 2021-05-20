import React from 'react';
import Component from 'react-component-component';
import { Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import SplitPane from 'react-split-pane';

import { SelectedModelsContext } from 'providers/SelectedModels';

import ArrowIcon from 'icons/ArrowIcon';

import LastUpdatedDate from 'components/LastUpdatedDate';
// TODO: uncomment to re-enable Expanded/Unexpanded toggle
// import ExpandedToggle from 'components/search/ExpandedToggle';
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
import TextInput from 'components/TextInput';
import {
  MultipleModelsTooltip,
  MolecularCharacterizationsTooltip,
  ClinicalVariantsTooltip,
  HistopathologicalBiomarkersTooltip,
  GenomicVariantsTooltip,
  ExpansionStatusTooltip,
} from 'components/tooltips';

import { useExpandedUnexpanded } from 'providers/ExpandedUnexpanded';

import globals from 'utils/globals';
import { filterExpanded, toggleExpanded } from 'utils/sqonHelpers';

import searchStyles, { MainCol } from 'theme/searchStyles';
import { Row, Col } from 'theme/system';

let stable = true;

export default ({
  setState,
  state,
  setSQON,
  sqon,
  savedSetsContext,
  history,
  version,
  ...props
}) => {
  const { showUnexpanded } = useExpandedUnexpanded();

  return (
    <>
      <Col css={searchStyles}>
        <SplitPane
          className="search-split-pane"
          split="vertical"
          minSize={50}
          defaultSize={state.panelSize}
          onChange={panelSize => {
            setState({ panelSize });
          }}
          onDragStarted={() => (stable = false)}
          onDragFinished={() => (stable = true)}
        >
          <Col className="aggregations-wrapper" role="complementary">
            <Component shouldUpdate={() => stable}>
              {() => (
                <>
                  <ModelSearch sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                  <GeneSearch sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                  <VariantSearch sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                  <Aggregations
                    {...props}
                    sqon={toggleExpanded(sqon, showUnexpanded)}
                    setSQON={setSQON}
                    index={props.index}
                    graphqlField={props.index}
                    componentProps={{
                      getTermAggProps: () => ({ maxTerms: 4 }),
                      InputComponent: TextInput,
                    }}
                  />
                </>
              )}
            </Component>
          </Col>
          <MainCol
            id="main"
            className="search-results-wrapper"
            p={30}
            flex={1}
            css={`
              width: calc(100vw - ${state.panelSize}px);
              overflow-y: scroll !important;
            `}
          >
            <Row
              css={`
                background-color: #f6f6f8;
                border: 1px solid #d9d9df;
                align-items: center;
                min-height: 50px;
              `}
            >
              {!filterExpanded(sqon) && (
                <Row
                  css={`
                    padding: 0 14px;
                    flex: 1;
                  `}
                >
                  <span className="sqon-field no-sqon-message">
                    <ArrowIcon css={'transform: rotate(180deg);'} />
                    Use the filter panel on the left to customize your model search.
                  </span>
                </Row>
              )}
              <CurrentSQON
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
              css={`
                margin: 8px 0;
                justify-content: space-around;
                border: 1px solid #d9d9df;
              `}
              aria-hidden={true}
            >
              <Component shouldUpdate={() => stable}>
                {() => (
                  <>
                    <PrimarySiteChart
                      sqon={toggleExpanded(sqon, showUnexpanded)}
                      setSQON={setSQON}
                    />
                    <MultipleModelsChart
                      sqon={toggleExpanded(sqon, showUnexpanded)}
                      setSQON={setSQON}
                    />
                    <GrowthChart sqon={toggleExpanded(sqon, showUnexpanded)} setSQON={setSQON} />
                    <TopVariantsChart
                      sqon={toggleExpanded(sqon, showUnexpanded)}
                      setSQON={setSQON}
                    />
                  </>
                )}
              </Component>
            </Row>
            <Component shouldUpdate={() => stable}>
              {() => (
                <SelectedModelsContext.Consumer>
                  {selectedModelContext => {
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
                    if (selectedModelContext.state.modelIds.length > 0) {
                      exporterOptions.unshift({
                        label: (
                          <div className="selectedModelsLabel">
                            ({selectedModelContext.state.modelIds.length} models selected)
                          </div>
                        ),
                      });
                    }
                    return (
                      <Table
                        {...props}
                        showFilterInput={false}
                        setSelectedTableRows={selectedRows =>
                          selectedModelContext.setModels(selectedRows)
                        }
                        selectedTableRows={selectedModelContext.state.modelIds}
                        loading={savedSetsContext.state.loading || props.loading}
                        sqon={toggleExpanded(sqon, showUnexpanded)}
                        setSQON={setSQON}
                        onSortedChange={sorted => setState({ sorted })}
                        alwaysSorted={[{ field: 'name', order: 'asc' }]}
                        customTypes={{
                          entity: props => (
                            <TableEntity
                              {...props}
                              savedSetsContext={savedSetsContext}
                              state={state}
                              sqon={toggleExpanded(sqon, showUnexpanded)}
                              history={history}
                            />
                          ),
                          distributor_link: props => (
                            <TableDistributorCell
                              {...props}
                              value={props.value}
                              savedSetsContext={savedSetsContext}
                              state={state}
                              sqon={toggleExpanded(sqon, showUnexpanded)}
                              history={history}
                            />
                          ),
                          expanded: props => (
                            <TableExpandedCell
                              {...props}
                              value={props.value}
                              savedSetsContext={savedSetsContext}
                              state={state}
                              sqon={toggleExpanded(sqon, showUnexpanded)}
                              history={history}
                            />
                          ),
                          matched_models: props => (
                            <TableMatchedModelsCell
                              {...props}
                              value={props.value}
                              savedSetsContext={savedSetsContext}
                              state={state}
                              sqon={toggleExpanded(sqon, showUnexpanded)}
                              history={history}
                            />
                          ),
                          list: props => <TableList {...props} />,
                        }}
                        customTypeConfigs={{
                          entity: {
                            minWidth: 140,
                          },
                          list: {
                            minWidth: 160,
                          },
                          age_at_sample_acquisition: { minWidth: 85 },
                          genes_count: { minWidth: 69 },
                          number: { minWidth: 88 },
                          expanded: { minWidth: 105 },
                          histo_variant_count: { minWidth: 108 },
                          matched_models: { minWidth: 84 },
                        }}
                        index={props.index}
                        graphqlField={props.index}
                        InputComponent={TextInput}
                        columnDropdownText="Columns"
                        enableSelectedTableRowsExporterFilter={true}
                        selectedRowsFilterPropertyName="_id"
                        exporterLabel="Export"
                        exporter={exporterOptions}
                        transformParams={params => ({
                          ...params,
                          url: `${globals.ARRANGER_API}/export/${version}/models`,
                        })}
                        fieldTypesForFilter={['text', 'keyword', 'id']}
                        // TODO: uncomment to re-enable Expanded/Unexpanded toggle
                        // customHeaderContent={<ExpandedToggle sqon={filterExpanded(sqon)} />}
                        enableDropDownControls={true}
                        sessionStorage={true}
                        storageKey={selectedModelContext.storageKey}
                        customColumns={[
                          {
                            content: {
                              field: 'matched_models_list',
                              displayName: 'Has Multiple Models',
                              Header: () => (
                                <Row space="space-between">
                                  Has Multiple Models <MultipleModelsTooltip isColumn={true} />
                                </Row>
                              ),
                            },
                          },
                          {
                            content: {
                              field: 'expanded',
                              displayName: 'Expansion Status',
                              Header: () => (
                                <Row justifyContent="space-between">
                                  Expansion Status <ExpansionStatusTooltip />
                                </Row>
                              ),
                            },
                          },
                          {
                            content: {
                              field: 'molecular_characterizations',
                              displayName: 'Available Molecular Characterizations',
                              Header: () => (
                                <Row space="space-between">
                                  Available Molecular Characterizations
                                  <MolecularCharacterizationsTooltip isColumn={true} />
                                </Row>
                              ),
                            },
                          },
                          {
                            content: {
                              field: 'gene_metadata.genomic_variant_count',
                              displayName: '# Research Somatic Variants',
                              Header: () => (
                                <Row space="space-between">
                                  # Research Somatic Variants
                                  <GenomicVariantsTooltip />
                                </Row>
                              ),
                            },
                          },
                          {
                            content: {
                              field: 'gene_metadata.clinical_variant_count',
                              displayName: '# Clinical Variants',
                              Header: () => (
                                <Row space="space-between">
                                  # Clinical Variants
                                  <ClinicalVariantsTooltip />
                                </Row>
                              ),
                            },
                          },
                          {
                            content: {
                              field: 'gene_metadata.histopathological_variant_count',
                              displayName: '# Histo-pathological Biomarkers',
                              Header: () => (
                                <Row space="space-between">
                                  # Histo-pathological Biomarkers
                                  <HistopathologicalBiomarkersTooltip />
                                </Row>
                              ),
                            },
                          },
                        ]}
                      />
                    );
                  }}
                </SelectedModelsContext.Consumer>
              )}
            </Component>
            <LastUpdatedDate />
          </MainCol>
        </SplitPane>
      </Col>
    </>
  );
};
