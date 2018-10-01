import React from 'react';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';
import { stringify } from 'query-string';

import { Row } from 'theme/system';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import ArrowRightIcon from 'icons/ArrowRightIcon';
import { SavedSetsContext } from 'providers/SavedSets';

export default ({ modelName, sqon, className }) => (
  <SavedSetsContext.Consumer>
    {context => {
      return (
        <Component
          name={modelName}
          loading={context.state.loading}
          items={
            (
              context.state.sets[
                (sqon || { content: { value: '' } }).content.value.replace('set_id', '')
              ] || { ids: [] }
            ).ids || []
          }
          didMount={({ props: { items } }) => {
            if (items.length === 0) {
              context.fetchSets({
                sqon,
              });
            }
          }}
          shouldUpdate={({ props, nextProps }) =>
            props.loading !== nextProps.loading || props.name !== nextProps.name
          }
        >
          {({
            props: { loading, name, items },
            currentIndex = items.indexOf(name),
            prevName = items[currentIndex - 1] || items[items.length - 1] || '',
            nextName = items[currentIndex + 1] || items[0] || '',
          }) => (
            <div
              css={`
                display: inline-block;
                ${className};
              `}
            >
              <Row
                className="pagination"
                css={loading ? 'pointer-events: none; pointer: not-allowed;' : ''}
                justifyContent="space-between"
              >
                <Link
                  to={{
                    pathname: `/model/${prevName}`,
                    search: stringify({ sqon: JSON.stringify(sqon) }),
                  }}
                  css={`
                    border-right: solid 1px #cacbcf;
                    opacity: ${loading || !prevName ? '0.5' : '1'};
                    pointer-events: ${loading || !prevName ? 'none' : 'inherit'};
                  `}
                >
                  <ArrowLeftIcon
                    height={9}
                    width={5}
                    fill="#900000"
                    css={`
                      opacity: ${loading ? '0.5' : '1'};
                      transition: opacity 0.5s ease-in;
                    `}
                  />
                  <span>PREVIOUS: {prevName}</span>
                </Link>
                <Row
                  justifyContent="center"
                  css={`
                    background-color: #f8fafb;
                    opacity: ${loading ? '0.5' : '1'};
                    transition: opacity 0.5s ease-in;
                    padding: 6px 12px;
                    flex: 1 1 auto;
                  `}
                >
                  Model {currentIndex + 1} of {items.length.toLocaleString()}
                </Row>
                <Link
                  to={{
                    pathname: `/model/${nextName}`,
                    search: stringify({ sqon: JSON.stringify(sqon) }),
                  }}
                  css={`
                    border-left: solid 1px #cacbcf;
                    opacity: ${loading || !nextName ? '0.5' : '1'};
                    pointer-events: ${loading || !nextName ? 'none' : 'inherit'};
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                  `}
                >
                  <span>NEXT: {nextName}</span>
                  <ArrowRightIcon
                    height={9}
                    width={5}
                    fill="#900000"
                    css={`
                      margin-left: 10px;
                      opacity: ${loading ? '0.5' : '1'};
                      transition: opacity 0.5s ease-in;
                    `}
                  />
                </Link>
              </Row>
              {loading && (
                <div
                  css={`
                    display: flex;
                    justify-content: center;
                    position: absolute;
                    width: 580px;
                    margin-top: -28px;
                  `}
                >
                  <Spinner fadeIn="half" name="circle" color="#900000" />
                </div>
              )}
            </div>
          )}
        </Component>
      );
    }}
  </SavedSetsContext.Consumer>
);
