import React from 'react';
import Component from 'react-component-component';
import moment from 'moment';
import { get } from 'lodash';

import { api } from '@arranger/components';
import Spinner from 'react-spinkit';
import globals from 'utils/globals';
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
                    therapy
                    licensing_required
                    date_of_availability
                    clinical_diagnosis {
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
    {({ state }) => (
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
                      'model type': state.model.type,
                      'split ratio': state.model.split_ratio,
                      growth_rate: `${state.model.growth_rate.toLocaleString()} days`,
                    }}
                  />
                </Col>

                <Col className="three-col">
                  <HorizontalTable
                    data={{
                      'primary site': state.model.primary_site,
                      'neoadjuvant therapy': state.model.neoadjuvant_therapy,
                      'pathological tnm stage': state.model.tnm_stage,
                      'molecular characterization': state.model.molecular_characterizations,
                      'chemotherapeutic drugs': { Y: 'Yes', N: 'No' }[
                        state.model.clinical_diagnosis.aquisition_site
                      ],
                    }}
                  />
                </Col>
                <Col className="three-col">
                  <HorizontalTable
                    data={{
                      'clinical tumor diagnosis': 'TBD',
                      'sample acquisition site': state.model.clinical_diagnosis.aquisition_site,
                      'histological type': state.model.clinical_diagnosis.histological_type,
                      'histological grade': state.model.clinical_diagnosis.tumor_histological_grade,
                      'clinical stage': state.model.clinical_diagnosis.clinical_stage_grouping,
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
                <Col className={state.model.model_image ? 'three-col' : 'two-col'}>
                  <h3>
                    <PatientIcon height={50} width={50} />
                    Patient Details
                  </h3>
                  <HorizontalTable
                    data={{
                      'age at diagnosis': `${state.model.age_at_diagnosis} years`,
                      'age of sample aquisition': `${state.model.age_at_aquisition} years`,
                      'vital status': state.model.vital_status,
                      'disease status': state.model.disease_status,
                      gender: state.model.gender,
                      race: state.model.race,
                      therapy: state.model.therapy,
                    }}
                  />
                </Col>

                <Col className={state.model.model_image ? 'three-col' : 'two-col'}>
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
                      'date availabile': moment(state.model.date_of_availability).format(
                        'DD/MM/YYYY',
                      ),
                      created: 'TBD',
                      updated: 'TBD',
                      'licensing requirement': state.model.licensing_required,
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
                {state.model.model_image && (
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
