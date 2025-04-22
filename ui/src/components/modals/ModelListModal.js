import React from 'react';
import { css } from '@emotion/react';
import Component from 'react-component-component';
import Spinner from 'react-spinkit';
import moment from 'moment-timezone';

import ModelListModalQuery from 'components/queries/ModelListModalQuery';
import cartDownload from 'utils/cartDownload';
import modelImageProcessor from 'utils/modelImageProcessor';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { ModalStateContext } from 'providers/ModalState';

import { Row } from 'theme/system';
import { ButtonPill } from 'theme/adminControlsStyles';

import DoubleArrowRightIcon from 'icons/DoubleArrowRightIcon';
import ModelIcon from 'icons/ModelIcon';
import TrashIcon from 'icons/TrashIcon';
import DownloadIcon from 'icons/DownloadIcon';
import modelListEmptyOrange from 'assets/icon-modellist-empty-orange.svg';

const EmptyList = () => (
  <div className="empty-list">
    <img src={modelListEmptyOrange} alt="Empty list icon" width="26" height="30" />
    <p>You don’t have any models selected.</p>
  </div>
);

const Loading = () => (
  <Row justifyContent="center">
    <Spinner
      fadeIn="full"
      name="ball-pulse-sync"
      style={{
        margin: 45,
        width: 90,
      }}
    />
  </Row>
);

const ModelListModal = () => (
  <ModalStateContext.Consumer>
    {(modalState) => (
      <SelectedModelsContext.Consumer>
        {(selected) => (
          <ModelListModalQuery selected={selected}>
            {({ state: queryState }) => (
              <Component
                loading={queryState.loading}
                models={queryState.models}
                didUpdate={() => {
                  // Slide the content in from right to left if not already done
                  if (
                    modalState.state.contentRef &&
                    modalState.state.contentRef.style.right !== 0
                  ) {
                    modalState.state.contentRef.style.right = 0;
                  }
                }}
              >
                {({ props: { loading, models } }) => {
                  const selectedCount = selected.state.modelIds.length;
                  const hasSelected = selectedCount > 0;
                  return (
                    <>
                      <div className="model-list-drawer-header">
                        <Row alignItems="baseline">
                          <button
                            aria-label={`Close Model List`}
                            onClick={() => modalState.setModalState({ component: null })}
                            css={css`
                              border: none;
                              cursor: pointer;
                            `}
                          >
                            <DoubleArrowRightIcon />
                          </button>
                          <h2>
                            My Model List
                            {hasSelected && <span className="count">{selectedCount}</span>}
                          </h2>
                        </Row>
                        <ButtonPill
                          secondary
                          disabled={!hasSelected}
                          onClick={() => selected.clearModels()}
                        >
                          Clear
                        </ButtonPill>
                      </div>
                      {hasSelected && loading && <Loading />}
                      {hasSelected && !loading ? (
                        <div className="model-list-scroll-container">
                          <div className="model-list-models">
                            {models.map((model, idx) => {
                              const modelImages = modelImageProcessor(
                                model.files ? model.files.hits.edges : [],
                              );
                              return (
                                <div className="model-list-model" key={idx}>
                                  {modelImages.length > 0 ? (
                                    <img
                                      src={modelImages[0].file_url}
                                      alt="model representation"
                                      width="100"
                                      height="74"
                                      className="model-image"
                                    />
                                  ) : (
                                    <div className="model-placeholder-image">
                                      <ModelIcon fill={'#b7bbbe'} width={'47px'} height={'47px'} />
                                    </div>
                                  )}

                                  <div className="model-list-model-content">
                                    <h3>{model.name}</h3>
                                    <p className="available-label">Available:</p>
                                    {model.date_of_availability &&
                                    model.date_of_availability !== null ? (
                                      <p className="available-date">
                                        {moment(model.date_of_availability).format('MMMM DD, YYYY')}
                                      </p>
                                    ) : (
                                      <p className="available-date">{`N/A`}</p>
                                    )}
                                  </div>
                                  <TrashIcon
                                    onClick={() => selected.toggleModel(model.id)}
                                    fill={'#000'}
                                    css={css`
                                      cursor: pointer;
                                      margin: 0 0 0 10px;
                                    `}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <EmptyList />
                      )}
                      <div className="download-tsv">
                        <ButtonPill
                          primary
                          disabled={!hasSelected}
                          onClick={() => cartDownload(selected.state.modelIds)}
                        >
                          <DownloadIcon
                            width={'12px'}
                            height={'12px'}
                            css={css`
                              margin-right: 4px;
                            `}
                          />
                          TSV (All Columns)
                        </ButtonPill>
                      </div>
                    </>
                  );
                }}
              </Component>
            )}
          </ModelListModalQuery>
        )}
      </SelectedModelsContext.Consumer>
    )}
  </ModalStateContext.Consumer>
);

export default ModelListModal;
