import React from 'react';
import { get } from 'lodash';
import Spinner from 'react-spinkit';

import ModelQuery from 'components/queries/ModelQuery';
import modelImageProcessor from 'utils/modelImageProcessor';
import apiDataProcessor from 'utils/apiDataProcessor';
import ModelBar from 'components/ModelBar';
import ModelFooterBar from 'components/ModelFooterBar';

import { Row, Col } from 'theme/system';
import styles from 'theme/modelStyles';
import { ModelSlider, ModelSlide, LeftArrow, RightArrow } from 'theme/carouselStyles';
import AdminIcon from 'icons/AdminIcon';
import ModelIcon from 'icons/ModelIcon';
import PatientIcon from 'icons/PatientIcon';
import CameraIcon from 'icons/CameraIcon';
import VariantsIcon from 'icons/VariantsIcon';
import VariantTables from 'components/VariantTables';
import ExternalLink from 'components/ExternalLink';
import ShareButton from 'components/ShareButton';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { imgPath } from 'utils/constants';

const HorizontalTable = ({
  fieldNames,
  rawData,
  extended,
  css,
  customUnits = {},
  customValue = {},
  data = (extended || [])
    .slice()
    .sort((a, b) => (fieldNames || []).indexOf(a) - (fieldNames || []).indexOf(b))
    .reduce((acc, { field, type, displayName, unit }) => {
      const fieldHelper = ({ field, type, displayName, unit }) =>
        fieldNames.includes(field)
          ? {
              ...acc,
              [field]: {
                key: displayName,
                value: apiDataProcessor({ data: get(rawData, field), type, unit }),
              },
            }
          : acc;
      return !Object.keys(customUnits).includes(field)
        ? fieldHelper({ field, type, displayName, unit })
        : fieldHelper({ field: field, type, displayName, unit: customUnits[field] || unit });
    }, {}),
}) => {
  return (
    <table className="entity-horizontal-table" css={css}>
      <tbody>
        {Object.keys(data).map(field => {
          const { key, value } = data[field];
          return (
            <tr key={key}>
              <td className="heading">{key}</td>
              <td className="content">
                {Object.keys(customValue).includes(field)
                  ? customValue[field](value)
                  : Array.isArray(value)
                  ? value.map((val, idx) => <div key={idx}>{`${val}`}</div>)
                  : value}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ({ modelName }) => (
  <ModelQuery modelName={modelName}>
    {({
      state: queryState,
      modelImages = modelImageProcessor(
        queryState.model && queryState.model.files && queryState.model.files.hits
          ? queryState.model.files.hits.edges
          : [],
      ),
    }) => (
      <div css={styles}>
        <ModelBar name={modelName} id={(queryState.model || { id: '' }).id} />
        {queryState.model ? (
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
                    link={`${window.location.origin}/model/${queryState.model.name}`}
                    quote={`HCMI Model ${queryState.model.name}`}
                  />
                  <SelectedModelsContext.Consumer>
                    {selected => {
                      const isSelected = selected.state.modelIds.includes(queryState.model.id);
                      return (
                        <button
                          onClick={() => selected.toggleModel(queryState.model.id)}
                          className={`pill select-model ${isSelected ? 'selected' : ''}`}
                          style={{ marginLeft: '10px' }}
                        >
                          {isSelected ? 'Selected for download' : 'Add model to my list'}
                        </button>
                      );
                    }}
                  </SelectedModelsContext.Consumer>
                </Row>
              </Row>
              <Row className="row">
                <Col className="three-col">
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={['name', 'type', 'split_ratio', 'time_to_split', 'growth_rate']}
                    customUnits={{ growth_rate: ' days' }}
                  />
                </Col>

                <Col className="three-col">
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'primary_site',
                      'neoadjuvant_therapy',
                      'tnm_stage',
                      'molecular_characterizations',
                      'chemotherapeutic_drugs',
                    ]}
                  />
                </Col>
                <Col className="three-col">
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'clinical_diagnosis.clinical_stage_grouping',
                      'tissue_type',
                      'clinical_diagnosis.clinical_tumor_diagnosis',
                      'clinical_diagnosis.site_of_sample_acquisition',
                      'clinical_diagnosis.histological_type',
                      'clinical_diagnosis.tumor_histological_grade',
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
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'age_at_diagnosis',
                      'age_at_sample_acquisition',
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
                    />
                    Repository Status
                  </h3>
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'date_of_availability',
                      'createdAt',
                      'updatedAt',
                      'licensing_required',
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
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'source_model_url',
                      'source_sequence_url',
                      'distributor_part_number',
                    ]}
                    customValue={{
                      distributor_part_number: val =>
                        val !== 'N/A' ? (
                          <ExternalLink href={`https://www.atcc.org/products/all/${val}`}>
                            {val}
                          </ExternalLink>
                        ) : (
                          'N/A'
                        ),
                      source_model_url: val =>
                        val !== 'N/A' ? (
                          <ExternalLink href={val}>Link to Source</ExternalLink>
                        ) : (
                          'N/A'
                        ),
                      source_sequence_url: val =>
                        val !== 'N/A' ? (
                          <ExternalLink href={val}>Link to Source</ExternalLink>
                        ) : (
                          'N/A'
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
                      />
                      Model Image{modelImages.length > 1 && 's'}
                    </h3>
                    <Col
                      css={`
                        color: #323232;
                        background: #fff;
                        border: solid 1px #cacbcf;
                      `}
                    >
                      <ModelSlider
                        LeftArrow={<LeftArrow />}
                        RightArrow={<RightArrow />}
                        autoSlide={false}
                        showDots={false}
                        cardsToShow={1}
                      >
                        {modelImages.map(
                          ({
                            file_id,
                            file_name,
                            scale_bar_length,
                            magnification,
                            passage_number,
                          }) => (
                            <ModelSlide>
                              <img src={`${imgPath}/${file_id}`} alt={`File name: ${file_name}`} />
                              {(scale_bar_length || magnification || passage_number) && (
                                <div
                                  css={`
                                    border-top: solid 1px #cacbcf;
                                    width: 100%;
                                    text-align: left;
                                    padding: 12px 0;
                                  `}
                                >
                                  {scale_bar_length && (
                                    <span className="image-caption">
                                      Scale-bar length: {scale_bar_length} μm
                                    </span>
                                  )}
                                  {magnification && (
                                    <span className="image-caption">
                                      Magnification: {magnification} x
                                    </span>
                                  )}
                                  {passage_number && (
                                    <span className="image-caption">
                                      Passage Number: {passage_number}
                                    </span>
                                  )}
                                </div>
                              )}
                            </ModelSlide>
                          ),
                        )}
                      </ModelSlider>
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
  </ModelQuery>
);
