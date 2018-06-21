import React from 'react';
import Component from 'react-component-component';
import Spinner from 'react-spinkit';
import moment from 'moment';
import { get, omit } from 'lodash';

import { api } from '@arranger/components';
import globals from 'utils/globals';
import tsvDownloader from 'utils/tsvDownloader';
import modelImageProcessor from 'utils/modelImageProcessor';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { ModalStateContext } from 'providers/ModalState';

import { Row } from 'theme/system';
import DoubleArrowRightIcon from 'icons/DoubleArrowRightIcon';
import ModelPlaceholderIcon from 'icons/ModelPlaceholderIcon';
import TrashIcon from 'icons/TrashIcon';
import DownloadIconWhite from 'icons/DownloadIconWhite';
import modelListEmptyRedPlus from 'assets/icon-modellist-empty-red.svg';

const EmptyList = () => (
  <div className="empty-list">
    <img src={modelListEmptyRedPlus} alt="Add to list icon" width="26" height="30" />
    <p>You don’t have any models selected.</p>
    <a href="/">Browse models »</a>
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

const fetchData = async ({ setState, modelIds }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql/ModelDataQuery`,
    body: {
      query: `query ModelDataQuery($filters: JSON) {
            models {
              extended
              hits(first: ${modelIds.length} filters: $filters) {
                edges {
                  node {
                    id
                    source_model_url
                    source_sequence_url
                    name
                    type
                    split_ratio
                    growth_rate
                    primary_site
                    neoadjuvant_therapy
                    tnm_stage
                    molecular_characterizations
                    age_at_diagnosis
                    vital_status
                    gender
                    race
                    chemotherapeutic_drug_list_available
                    age_at_aquisition
                    disease_status
                    files {
                      hits{
                        edges {
                          node {
                            file_name
                            file_type
                          }
                        }
                      }
                    }
                    therapy
                    licensing_required
                    date_of_availability
                    date_created
                    date_updated
                    clinical_diagnosis {
                      clinical_tumor_diagnosis
                      aquisition_site
                      histological_type
                      histologcal_grade
                      clinical_stage_grouping
                    }
                  }
                }
              }
            }
          }`,
      variables: {
        filters: { op: 'in', content: { field: '_id', value: modelIds } },
      },
    },
  });
  setState({
    models: get(data, `models.hits.edges`, []).map(edge => edge.node),
    loading: false,
  });
};

export default () => (
  <ModalStateContext.Consumer>
    {modalState => (
      <SelectedModelsContext.Consumer>
        {selected => (
          <Component
            selected={selected}
            modalState={modalState}
            initialState={{ models: [], loading: true }}
            didMount={async ({ setState }) => {
              await fetchData({ setState, modelIds: selected.state.modelIds });
            }}
            didUpdate={async ({ setState, props, prevProps, state }) => {
              // Slide the content in from right to left if not already done
              if (modalState.state.contentRef && modalState.state.contentRef.style.right !== 0) {
                modalState.state.contentRef.style.right = 0;
              }

              // Currently we can only remove items from this component so
              // no need to query everytime we remove items from the list
              const newModelId = props.selected.state.modelIds;
              if (newModelId.length < prevProps.selected.state.modelIds.length && !state.loading) {
                setState({
                  ...state,
                  models: state.models.filter(model => newModelId.indexOf(model.id) !== -1),
                });
              }
            }}
          >
            {({ state }) => {
              const selectedCount = selected.state.modelIds.length;
              const hasSelected = selectedCount > 0;
              return (
                <>
                  <div className="model-list-drawer-header">
                    <h2>
                      <DoubleArrowRightIcon width={18} height={15} />
                      My Model List{hasSelected ? (
                        <span className="count">{selectedCount}</span>
                      ) : null}
                    </h2>
                    <button
                      disabled={!hasSelected}
                      onClick={() => selected.clearModels()}
                      className="clear"
                    >
                      Clear
                    </button>
                  </div>
                  {hasSelected && state.loading ? <Loading /> : null}
                  {hasSelected && !state.loading ? (
                    <div className="model-list-scroll-container">
                      <div className="model-list-models">
                        {state.models.map((model, idx) => {
                          const modelImages = modelImageProcessor(
                            model.files ? model.files.hits.edges : [],
                          );
                          return (
                            <div className="model-list-model" key={idx}>
                              {modelImages.length > 0 ? (
                                <img
                                  src={modelImages[0].file_name}
                                  alt="model representation"
                                  width="100"
                                  height="74"
                                  className="model-image"
                                />
                              ) : (
                                <div className="model-placeholder-image">
                                  <ModelPlaceholderIcon width={47} height={47} />
                                </div>
                              )}

                              <div className="model-list-model-content">
                                <h3>{model.name}</h3>
                                <p className="available-label">Available:</p>
                                <p className="available-date">
                                  {moment(model.date_of_availability).format('MMMM DD, YYYY')}
                                </p>
                              </div>
                              <TrashIcon
                                width={13}
                                height={17}
                                onClick={() => selected.toggleModel(model.id)}
                                css={`
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
                    <button
                      className="download-tsv-btn"
                      disabled={!hasSelected}
                      onClick={() =>
                        tsvDownloader(
                          `models-list-${moment(Date.now()).format('MM-DD-YYYY')}`,
                          state.models.map(model => omit(model, ['files'])),
                        )
                      }
                    >
                      <DownloadIconWhite
                        width={12}
                        height={14}
                        css={`
                          margin-right: 14px;
                        `}
                      />Download TSV
                    </button>
                  </div>
                </>
              );
            }}
          </Component>
        )}
      </SelectedModelsContext.Consumer>
    )}
  </ModalStateContext.Consumer>
);
