import React from 'react';
import Component from 'react-component-component';
import { Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import SplitPane from 'react-split-pane';
import searchStyles from 'theme/searchStyles';
import Quicksearch from 'components/Quicksearch';
import PrimarySiteChart from 'components/charts/PrimarySiteChart';
import GrowthChart from 'components/charts/GrowthChart';
import TableEntity from 'components/TableEntity';
import { Row, Col } from 'theme/system';
import { SelectedModelsContext } from 'providers/SelectedModels';

let stable = true;

export default ({ setState, state, setSQON, sqon, savedSetsContext, history, ...props }) => (
  <Row css={searchStyles}>
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
              <Quicksearch {...{ ...props, setSQON }} />
              <Aggregations
                {...props}
                sqon={sqon}
                setSQON={setSQON}
                index={props.index}
                graphqlField={props.index}
                componentProps={{
                  getTermAggProps: () => ({ maxTerms: 4 }),
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
        `}
      >
        <Row>
          {!sqon && (
            <Row
              css={`
                line-height: 50px;
                padding: 0 14px;
                background-color: white;
                flex: 1;
              `}
            >
              <span
                className="sqon-field no-sqon-message"
                css={`
                  font-size: 12px;
                `}
              >
                Use the filter panel on the left to customize your model search.
              </span>
            </Row>
          )}
          <CurrentSQON
            {...props}
            sqon={sqon}
            setSQON={setSQON}
            index={props.index}
            graphqlField={props.index}
          />
        </Row>
        <Row
          bg="white"
          css={`
            height: 185px;
            padding: 16px;
          `}
        >
          <Component shouldUpdate={() => stable}>
            {() => (
              <>
                <PrimarySiteChart sqon={sqon} setSQON={setSQON} />
                <GrowthChart sqon={sqon} setSQON={setSQON} />
              </>
            )}
          </Component>
        </Row>
        <Component shouldUpdate={() => stable}>
          {() => (
            <SelectedModelsContext.Consumer>
              {selected => {
                return (
                  <Table
                    {...props}
                    setSelectedTableRows={selectedRows =>
                      selected.setModels({ models: selectedRows })
                    }
                    keepSelectedOnPageChange={true}
                    initalSelectedTableRows={selected.state.models}
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
                    }}
                    index={props.index}
                    graphqlField={props.index}
                    columnDropdownText="Columns"
                    fieldTypesForFilter={['text', 'keyword', 'id']}
                  />
                );
              }}
            </SelectedModelsContext.Consumer>
          )}
        </Component>
      </Col>
    </SplitPane>
  </Row>
);
