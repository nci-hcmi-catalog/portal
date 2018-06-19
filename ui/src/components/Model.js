import React from 'react';
import Component from 'react-component-component';
import { get } from 'lodash';

import { api } from '@arranger/components';
import Spinner from 'react-spinkit';
import globals from 'utils/globals';
import modelImageProcessor from 'utils/modelImageProcessor';
import apiDataProcessor from 'utils/apiDataProcessor';
import ModelBar from 'components/ModelBar';
import ModelFooterBar from 'components/ModelFooterBar';
import { Row, Col } from 'theme/system';

import styles from 'theme/modelStyles';
import AdminIcon from 'icons/AdminIcon';
import ModelIcon from 'icons/ModelIcon';
import PatientIcon from 'icons/PatientIcon';
import CameraIcon from 'icons/CameraIcon';
import VariantsIcon from 'icons/VariantsIcon';
import VariantTables from 'components/VariantTables';
import ExternalLink from 'components/ExternalLink';
import ShareButton from 'components/ShareButton';
import { SelectedModelsContext } from 'providers/SelectedModels';

const HorizontalTable = ({
  fieldNames,
  rawData,
  extended,
  css,
  data = (extended || [])
    .slice()
    .sort((a, b) => (fieldNames || []).indexOf(a) - (fieldNames || []).indexOf(b))
    .reduce(
      (acc, { field, type, displayName, unit }) =>
        fieldNames.includes(field)
          ? {
              ...acc,
              [displayName]: apiDataProcessor({ data: get(rawData, field), type, unit }),
            }
          : acc,
      {},
    ),
}) => (
  <table className="entity-horizontal-table" css={css}>
    <tbody>
      {Object.keys(data).map(key => (
        <tr key={key}>
          <td className="heading">{key}</td>
          <td className="content">{data[key]}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const fetchData = async ({ setState, modelName }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql/ModelDataQuery`,
    body: {
      query: `query ModelDataQuery($filters: JSON) {
            models {
              extended
              hits(first: 1 filters: $filters) {
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
        filters: { op: 'in', content: { field: 'name', value: [modelName] } },
      },
    },
  });
  setState({
    model: get(data, `models.hits.edges[0].node`, {}),
    extended: get(data, `models.extended`),
    loading: false,
  });
};

export default ({ modelName }) => (
  <Component
    modelName={modelName}
    initialState={{ model: null, loading: true, extended: [] }}
    didMount={async ({ setState, props }) => {
      await fetchData({ setState, modelName: props.modelName });
    }}
    didUpdate={async ({ setState, props, prevProps, state }) => {
      if (props.modelName !== prevProps.modelName && !state.loading) {
        setState({ loading: true });
        await fetchData({ setState, modelName: props.modelName });
      }
    }}
    shouldUpdate={({ state, props, nextProps, nextState }) =>
      state.loading !== nextState.loading || props.modelName !== nextProps.modelName
    }
  >
    {({
      state,
      modelImages = modelImageProcessor(state.model ? state.model.files.hits.edges : []),
    }) => (
      <div css={styles}>
        <ModelBar name={modelName} id={(state.model || { id: '' }).id} />
        {state.model ? (
          [
            <section
              key="model-details"
              className="model-section"
              css={`
                background-color: #f3f6f7;
              `}
            >
              <Row className="model-details-header">
                <h3>
                  <ModelIcon height={50} width={50} />
                  Model Details
                </h3>
                <Row
                  className="model-actions"
                  css={`
                    width: 30%;
                    justify-content: flex-end;
                  `}
                >
                  <ShareButton
                    link={`${window.location.origin}/model/${state.model.name}`}
                    quote={`HCMI Model ${state.model.name}`}
                    leftOffset="44px"
                  />
                  <SelectedModelsContext.Consumer>
                    {selected => {
                      const isSelected = selected.state.models.includes(state.model);
                      return (
                        <div
                          onClick={() => selected.toggleModel(state.model)}
                          className={`pill select-model ${isSelected ? 'selected' : ''}`}
                          style={{ marginLeft: '10px' }}
                        >
                          {isSelected ? 'Selected for download' : 'Add model to my list'}
                        </div>
                      );
                    }}
                  </SelectedModelsContext.Consumer>
                </Row>
              </Row>
              <Row className="row">
                <Col className="three-col">
                  <HorizontalTable
                    rawData={state.model}
                    extended={state.extended}
                    fieldNames={['name', 'type', 'split_ratio', 'growth_rate']}
                  />
                </Col>

                <Col className="three-col">
                  <HorizontalTable
                    rawData={state.model}
                    extended={state.extended}
                    fieldNames={[
                      'primary_site',
                      'neoadjuvant_therapy',
                      'tnm_stage',
                      'molecular_characterizations',
                      'chemotherapeutic_drug_list_available',
                    ]}
                  />
                </Col>
                <Col className="three-col">
                  <HorizontalTable
                    rawData={state.model}
                    extended={state.extended}
                    fieldNames={[
                      'clinical_diagnosis.clinical_tumor_diagnosis',
                      'clinical_diagnosis.aquisition_site',
                      'clinical_diagnosis.histological_type',
                      'clinical_diagnosis.histologcal_grade',
                      'clinical_diagnosis.clinical_stage_grouping',
                    ]}
                  />
                </Col>
              </Row>
            </section>,
            <section
              key="patient-details"
              className="model-section"
              css={`
                background-color: #ebf1f3;
              `}
            >
              <Row className="row">
                <Col className={modelImages ? 'three-col' : 'two-col'}>
                  <h3>
                    <PatientIcon height={50} width={50} />
                    Patient Details
                  </h3>
                  <HorizontalTable
                    rawData={state.model}
                    extended={state.extended}
                    fieldNames={[
                      'age_at_diagnosis',
                      'state.model.age_at_aquisition',
                      'vital_status',
                      'disease_status',
                      'gender',
                      'race',
                      'therapy',
                    ]}
                  />
                </Col>

                <Col className={modelImages ? 'three-col' : 'two-col'}>
                  <h3>
                    <AdminIcon
                      height={50}
                      width={50}
                      css={`
                        fill: #900000;
                      `}
                    />{' '}
                    Model Administration
                  </h3>
                  <HorizontalTable
                    rawData={state.model}
                    extended={state.extended}
                    fieldNames={[
                      'date_of_availability',
                      'date_created',
                      'date_updated',
                      'licensing_required',
                      'gender',
                    ]}
                  />
                  <div
                    css={`
                      background-color: #ffffff;
                      border-left: solid 1px #cacbcf;
                      border-right: solid 1px #cacbcf;
                      padding: 5px;
                      margin-right: 1px;
                      font-size: 14px;
                      line-height: 1.71;
                      color: #900000;
                    `}
                  >
                    External Resources
                  </div>
                  <HorizontalTable
                    data={{
                      model: (
                        <ExternalLink href={state.model.source_model_url}>
                          Link to Source
                        </ExternalLink>
                      ),
                      'original sequencing files': (
                        <ExternalLink href={state.model.source_sequence_url}>
                          Link to Source
                        </ExternalLink>
                      ),
                    }}
                  />
                </Col>
                {modelImages && (
                  <Col className="three-col">
                    <h3>
                      <CameraIcon
                        height={50}
                        width={50}
                        css={`
                          fill: #900000;
                        `}
                      />{' '}
                      Model Image
                    </h3>
                    <Col
                      css={`
                        color: #323232;
                        background: #fff;
                        border: solid 1px #cacbcf;
                      `}
                    >
                      <img
                        src={modelImages[0].file_name}
                        alt={`File name: ${modelImages[0].file_name}`}
                        css={`
                          display: block;
                          width: 100%;
                          height: auto;
                          padding: 20px;
                        `}
                      />
                      <div
                        css={`
                          border-top: solid 1px #cacbcf;
                          width: 100%;
                          text-align: left;
                          padding: 20px;
                        `}
                      >
                        <span className="image-caption">image description</span>
                      </div>
                    </Col>
                  </Col>
                )}
              </Row>
            </section>,
            <section
              key="variants"
              className="model-section"
              css={`
                background-color: #f3f6f7;
              `}
            >
              <h3>
                <VariantsIcon height={50} width={50} />
                Variants
              </h3>
              <Col>
                <VariantTables modelName={modelName} />
              </Col>
            </section>,
          ]
        ) : (
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
        )}

        <ModelFooterBar name={modelName} />
      </div>
    )}
  </Component>
);
