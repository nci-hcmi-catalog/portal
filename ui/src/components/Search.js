import React from 'react';
import Component from 'react-component-component';
import { Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import SplitPane from 'react-split-pane';
import Popup from 'reactjs-popup';

import { SelectedModelsContext } from 'providers/SelectedModels';

import ArrowIcon from './../icons/ArrowIcon';
import QuestionMarkIcon from './../icons/QuestionMarkIcon';

import LastUpdatedDate from './LastUpdatedDate';
import ModelNameSearch from 'components/ModelNameSearch';
import PrimarySiteChart from 'components/charts/PrimarySiteChart';
import MultipleModelsChart from 'components/charts/MultipleModelsChart';
import GrowthChart from 'components/charts/GrowthChart';
import Toggle from 'components/input/Toggle';
import TableEntity from 'components/TableEntity';
import TableExpandedCell from 'components/TableExpandedCell';
import TableMatchedModelsCell from 'components/TableMatchedModelsCell';
import TableList from 'components/TableList';
import ShareButton from 'components/ShareButton';
import ModelList from 'components/ModelList';
import TextInput from './TextInput';

import globals from '../utils/globals';
import { filteredSqon } from 'utils/sqonHelpers';

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
}) => (
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
                <ModelNameSearch {...{ ...props, setSQON }} />
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
            {!filteredSqon(sqon) && (
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
              sqon={filteredSqon(sqon)}
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
                  {/* <TopVariantsChart sqon={sqon} setSQON={setSQON} /> */}
                  <MultipleModelsChart sqon={sqon} setSQON={setSQON} />
                  <GrowthChart sqon={sqon} setSQON={setSQON} />
                </>
              )}
            </Component>
          </Row>
          <Row alignItems={'center'}>
            <Toggle id="expanded-toggle" initialValue={false} />
            <label
              htmlFor="expanded-toggle"
              css={`
                font-size: 12px;
                margin-left: 5px;
              `}
            >
              {false ? 'Hide' : 'Show'} XXX unexpanded models
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
                      setSelectedTableRows={selectedRows => selected.setModels(selectedRows)}
                      keepSelectedOnPageChange={true}
                      selectedTableRows={selected.state.modelIds}
                      loading={savedSetsContext.state.loading || props.loading}
                      sqon={sqon}
                      setSQON={setSQON}
                      onSortedChange={sorted => setState({ sorted })}
                      alwaysSorted={[{ field: 'name', order: 'asc' }]}
                      customTypes={{
                        entity: props => (
                          <TableEntity
                            {...props}
                            savedSetsContext={savedSetsContext}
                            state={state}
                            sqon={sqon}
                            history={history}
                          />
                        ),
                        expanded: props => (
                          <TableExpandedCell
                            {...props}
                            value={props.value}
                            savedSetsContext={savedSetsContext}
                            state={state}
                            sqon={sqon}
                            history={history}
                          />
                        ),
                        matched_models: props => (
                          <TableMatchedModelsCell
                            {...props}
                            value={props.value}
                            savedSetsContext={savedSetsContext}
                            state={state}
                            sqon={sqon}
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
