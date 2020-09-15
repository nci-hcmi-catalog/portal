import React, { useState } from 'react';
import Component from 'react-component-component';
import { Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import SplitPane from 'react-split-pane';
import Popup from 'reactjs-popup';

import { SelectedModelsContext } from 'providers/SelectedModels';

import ArrowIcon from 'icons/ArrowIcon';
import QuestionMarkIcon from 'icons/QuestionMarkIcon';

import LastUpdatedDate from 'components/LastUpdatedDate';
import GeneSearch from 'components/search/GeneSearch';
import VariantSearch from 'components/search/VariantSearch';
import ModelSearch from 'components/search/ModelSearch';
import PrimarySiteChart from 'components/charts/PrimarySiteChart';
import MultipleModelsChart from 'components/charts/MultipleModelsChart';
import GrowthChart from 'components/charts/GrowthChart';
import TopVariantsChart from 'components/charts/TopVariantsChart';
import Toggle from 'components/input/Toggle';
import TableEntity from 'components/TableEntity';
import TableDistributorCell from 'components/TableDistributorCell';
import TableExpandedCell from 'components/TableExpandedCell';
import TableMatchedModelsCell from 'components/TableMatchedModelsCell';
import TableList from 'components/TableList';
import ShareButton from 'components/ShareButton';
import ModelList from 'components/ModelList';
import TextInput from 'components/TextInput';

import globals from 'utils/globals';
import { filterExpanded, toggleExpanded } from 'utils/sqonHelpers';

import searchStyles from 'theme/searchStyles';
import { Row, Col } from 'theme/system';

let stable = true;

export default ({
  setState,
  state,
  setSQON,
  sqon = { op: 'and', content: [{ op: 'in', content: { field: 'expanded', value: ['true'] } }] },
  savedSetsContext,
  history,
  version,
  ...props
}) => {
  const [showUnexpanded, setShowUnexpanded] = useState(false);

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
          <Col className="aggregations-wrapper">
            <Component shouldUpdate={() => stable}>
              {() => (
                <>
                  <ModelSearch sqon={sqon} setSQON={setSQON} />
                  <GeneSearch sqon={sqon} setSQON={setSQON} />
                  <VariantSearch sqon={sqon} setSQON={setSQON} />
                  <Aggregations
                    {...props}
                    sqon={sqon}
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
          <Col
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
            >
              <Component shouldUpdate={() => stable}>
                {() => (
                  <>
                    <PrimarySiteChart sqon={sqon} setSQON={setSQON} />
                    <MultipleModelsChart sqon={sqon} setSQON={setSQON} />
                    <GrowthChart sqon={sqon} setSQON={setSQON} />
                    <TopVariantsChart sqon={sqon} setSQON={setSQON} />
                  </>
                )}
              </Component>
            </Row>
            <Row alignItems={'center'}>
              <Toggle
                id="expanded-toggle"
                initialValue={showUnexpanded}
                onValueChange={() => setShowUnexpanded(!showUnexpanded)}
              />
              <label
                htmlFor="expanded-toggle"
                css={`
                  font-size: 12px;
                  margin-left: 5px;
                `}
              >
                {showUnexpanded ? 'Hide' : 'Show'} XXX unexpanded models
              </label>
              <Popup
                trigger={() => (
                  <div
                    css={`
                      display: flex;
                      margin-left: 5px;
                    `}
                  >
                    <QuestionMarkIcon />
                  </div>
                )}
                on="hover"
                position={'top right'}
                width={'225px'}
                mouseEnterDelay={100}
              >
                <div
                  css={`
                    font-size: 12px;
                  `}
                >
                  <b>Expanded models</b> are available for purchase on ATCC.
                  <br />
                  <b>Unexpanded models</b> have passed sequencing validation QC, but are not yet
                  available for purchase.
                </div>
              </Popup>
            </Row>
            <Component shouldUpdate={() => stable}>
              {() => (
                <SelectedModelsContext.Consumer>
                  {selected => {
                    return (
                      <Table
                        {...props}
                        showFilterInput={false}
                        setSelectedTableRows={selectedRows => selected.setModels(selectedRows)}
                        keepSelectedOnPageChange={true}
                        selectedTableRows={selected.state.modelIds}
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
                          number: { minWidth: 75 },
                          expanded: { minWidth: 80 },
                          histo_variant_count: { minWidth: 90 },
                          matched_models: { minWidth: 68 },
                        }}
                        index={props.index}
                        graphqlField={props.index}
                        InputComponent={TextInput}
                        columnDropdownText="Columns"
                        exportTSVText="Export All"
                        transformParams={params => ({
                          ...params,
                          url: `${globals.ARRANGER_API}/export/${version}/models`,
                        })}
                        fieldTypesForFilter={['text', 'keyword', 'id']}
                      />
                    );
                  }}
                </SelectedModelsContext.Consumer>
              )}
            </Component>
            <LastUpdatedDate />
          </Col>
        </SplitPane>
      </Col>
    </>
  );
};
