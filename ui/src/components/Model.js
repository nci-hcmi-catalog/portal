import React from 'react';
import Component from 'react-component-component';
import moment from 'moment';
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

const HorizontalTable = ({ data, css }) => (
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
    endpoint: `${globals.VERSION}/graphql`,
    body: {
      query: `query($filters: JSON) {
            models {
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

  setState({ model: get(data, `models.hits.edges[0].node`, {}), loading: false });
};

export default ({ modelName }) => (
  <Component
    modelName={modelName}
    initialState={{ model: null, loading: true }}
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
              <h3>
                <ModelIcon height={50} width={50} />
                Model Details
              </h3>
              <Row className="row">
                <Col className="three-col">
                  <HorizontalTable
                    data={{
                      name: state.model.name,
                      'model type': apiDataProcessor(state.model.type),
                      'split ratio': apiDataProcessor(state.model.split_ratio),
                      growth_rate: apiDataProcessor(
                        state.model.growth_rate,
                        `${state.model.growth_rate.toLocaleString()} days`,
                      ),
                    }}
                  />
                </Col>

                <Col className="three-col">
                  <HorizontalTable
                    data={{
                      'primary site': apiDataProcessor(state.model.primary_site),
                      'neoadjuvant therapy': apiDataProcessor(
                        state.model.neoadjuvant_therapy ? 'True' : 'False',
                      ),
                      'pathological tnm stage': apiDataProcessor(state.model.tnm_stage),
                      'molecular characterization': apiDataProcessor(
                        state.model.molecular_characterizations,
                      ),
                      'chemotherapeutic drugs': apiDataProcessor(
                        state.model.chemotherapeutic_drug_list_available ? 'Yes' : 'No',
                      ),
                    }}
                  />
                </Col>
                <Col className="three-col">
                  {console.log(state.model.clinical_diagnosis)}
                  <HorizontalTable
                    data={{
                      'clinical tumor diagnosis': apiDataProcessor(
                        state.model.clinical_diagnosis.clinical_tumor_diagnosis,
                      ),
                      'sample acquisition site': apiDataProcessor(
                        state.model.clinical_diagnosis.aquisition_site,
                      ),
                      'histological type': apiDataProcessor(
                        state.model.clinical_diagnosis.histological_type,
                      ),
                      'histological grade': apiDataProcessor(
                        state.model.clinical_diagnosis.histologcal_grade,
                      ),
                      'clinical stage': apiDataProcessor(
                        state.model.clinical_diagnosis.clinical_stage_grouping,
                      ),
                    }}
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
                    data={{
                      'age at diagnosis': apiDataProcessor(
                        state.model.age_at_diagnosis,
                        `${state.model.age_at_diagnosis} years`,
                      ),
                      'age of sample aquisition': apiDataProcessor(
                        state.model.age_at_aquisition,
                        `${state.model.age_at_aquisition} years`,
                      ),
                      'vital status': apiDataProcessor(state.model.vital_status),
                      'disease status': apiDataProcessor(state.model.disease_status),
                      gender: apiDataProcessor(state.model.gender),
                      race: apiDataProcessor(state.model.race),
                      therapy: apiDataProcessor(state.model.therapy),
                    }}
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
                  {console.log(state.model)}
                  <HorizontalTable
                    data={{
                      'date availabile': apiDataProcessor(
                        state.model.date_of_availability,
                        moment(state.model.date_of_availability).format('DD/MM/YYYY'),
                      ),
                      created: apiDataProcessor(
                        state.model.date_created,
                        moment(state.model.date_created).format('DD/MM/YYYY'),
                      ),
                      updated: apiDataProcessor(
                        state.model.date_updated,
                        moment(state.model.date_updated).format('DD/MM/YYYY'),
                      ),
                      'licensing requirement': apiDataProcessor(
                        state.model.licensing_required ? 'Yes' : 'No',
                      ),
                      gender: apiDataProcessor(state.model.gender),
                    }}
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
