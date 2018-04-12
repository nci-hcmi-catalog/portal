import React from 'react';
import Component from 'react-component-component';
import moment from 'moment';

import { api } from '@arranger/components';
import globals from 'utils/globals';
import ModelBar from 'components/ModelBar';
import ModelFooterBar from 'components/ModelFooterBar';
import { Row, Col } from 'components/Layout';
import Spinner from 'react-spinkit';

import styles from 'utils/modelStyles';
import AdminIcon from 'icons/AdminIcon';
import ModelIcon from 'icons/ModelIcon';
import PatientIcon from 'icons/PatientIcon';

const HorizontalTable = ({ data, css }) => (
  <table className="entity-horizontal-table" css={css}>
    <tbody>
      {Object.keys(data).map(key => (
        <tr key={key}>
          <td className="heading">{key}</td>
          <td>{data[key]}</td>
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
                    name
                    model_type
                    split_ratio
                    model_growth_rate
                    primary_site
                    neoadjuvant_therapy
                    pathological_tnm_stage
                    molecular_characterization
                    list_of_chemo_drugs_available
                    sample_acquisition_site
                    histological_type
                    tumor_histological_grade
                    clinical_stage
                    histopathological_biomarkers
                    age_at_diagnosis
                    age_at_sampling
                    vital_status
                    disease_status_at_unlinking
                    gender
                    race
                    therapies
                    third_party_licensing_requirement
                    model_availability
                    model_image
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

  setState({ model: data.models.hits.edges[0].node, loading: false });
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
    {({ state }) => (
      <div css={styles}>
        <ModelBar name={modelName} />
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
                <Col className="col">
                  <HorizontalTable
                    data={{
                      name: state.model.name,
                      'model type': state.model.model_type,
                      'split ratio': state.model.split_ratio,
                      model_growth_rate: `${state.model.model_growth_rate.toLocaleString()} days`,
                    }}
                  />
                </Col>

                <Col className="col">
                  <HorizontalTable
                    data={{
                      'primary site': state.model.primary_site,
                      'neoadjuvant therapy': state.model.neoadjuvant_therapy,
                      'pathological tnm stage': state.model.pathological_tnm_stage,
                      'molecular characterization': state.model.molecular_characterization,
                      'chemotherapeutic drugs': { Y: 'Yes', N: 'No' }[
                        state.model.list_of_chemo_drugs_available
                      ],
                    }}
                  />
                </Col>
                <Col className="col">
                  <HorizontalTable
                    data={{
                      'clinical tumor diagnosis': 'TBD',
                      'sample acquisition site': state.model.sample_acquisition_site,
                      'histological type': state.model.histological_type,
                      'histological grade': state.model.tumor_histological_grade,
                      'clinical stage': state.model.clinical_stage,
                      'histopathological biomarkers': (
                        state.model.histopathological_biomarkers || []
                      ).join(', '),
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
                <Col className="col">
                  <h3>
                    <PatientIcon height={50} width={50} />
                    Patient Details
                  </h3>
                  <HorizontalTable
                    data={{
                      'age at diagnosis': `${state.model.age_at_diagnosis} years`,
                      'age of sample aquisition': `${state.model.age_at_sampling} years`,
                      'vital status': state.model.vital_status,
                      'disease status': state.model.disease_status_at_unlinking,
                      gender: state.model.gender,
                      race: state.model.race,
                      therapy: (state.model.therapies || []).join(', '),
                    }}
                  />
                </Col>

                <Col className="col">
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
                    data={{
                      'date availabile': moment(state.model.model_availability).format(
                        'DD/MM/YYYY',
                      ),
                      created: 'TBD',
                      updated: 'TBD',
                      'licensing requirement': state.model.third_party_licensing_requirement,
                      gender: state.model.gender,
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
                      model: 'link to GDC/EGA',
                      'original sequencing files': 'link to GDC/EGA',
                    }}
                  />
                </Col>
                <Col
                  className="col"
                  css={`
                    color: #323232;
                    background: #fff;
                    border: solid 1px #cacbcf;
                    align-items: center;
                  `}
                >
                  <div
                    css={`
                      width: 400px;
                      height: 282px;
                      background: #ddd;
                      margin: 20px;
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
              </Row>
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
