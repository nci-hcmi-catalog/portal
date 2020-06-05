import React from 'react';
import { get } from 'lodash';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';

import ModelQuery from 'components/queries/ModelQuery';
import modelImageProcessor from 'utils/modelImageProcessor';
import apiDataProcessor from 'utils/apiDataProcessor';
import ModelBar from 'components/ModelBar';
import ModelFooterBar from 'components/ModelFooterBar';

import { Row, Col } from 'theme/system';
import styles from 'theme/modelStyles';
import theme from 'theme';
import { ModelSlider, ModelSlide, LeftArrow, RightArrow } from 'theme/carouselStyles';
import ModelIcon from 'icons/ModelIcon';
import VariantTables from 'components/VariantTables';
import ExternalLink from 'components/ExternalLink';
import { imgPath } from 'utils/constants';
import base from 'theme';

const {
  keyedPalette: { brandPrimary },
} = base;

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

const MultipleModelContent = match => {
  return (
    <div
      css={`
        margin-bottom: 10px;
        display: flex;
      `}
      key={match.name}
    >
      <div
        css={`
          padding-top: 2px;
        `}
      >
        <ModelIcon height={18} width={18} />
      </div>
      <div>
        <Link
          to={{
            pathname: `/model/${match.name}`,
          }}
          href=""
          css={`
            color: ${theme.keyedPalette.brandPrimary};
          `}
        >
          {match.name}
        </Link>
        <br />
        <span
          css={`
            font-size: 12px;
          `}
        >
          Tissue Type: {match.tissue_type || 'N/A'}
        </span>
        <br />
      </div>
    </div>
  );
};

const MultipleModelsList = ({ matches }) => {
  console.log('matches', matches);
  switch (true) {
    case matches.length > 0:
      return matches.map(MultipleModelContent);
    default:
      return 'There are no other models from this patient';
  }
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
        <ModelBar
          name={modelName}
          id={(queryState.model || { id: '' }).id}
          isExpanded={queryState.model ? queryState.model.expanded : null}
        />
        {queryState.model ? (
          [
            <section key="model-details" className="model-section">
              <Row className="row">
                <Col className="three-col">
                  {/* Model Details */}
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'type',
                      'split_ratio',
                      'time_to_split',
                      'growth_rate',
                      'tissue_type',
                      // 'matched_models.name',
                    ]}
                    customUnits={{ growth_rate: ' days' }}
                    // customValue={{
                    //   'matched_models.name': val => (
                    //     // ============================================================== Multiple Models
                    //     <MultipleModelsList
                    //       matches={queryState.model.matched_models.hits.edges.map(
                    //         match => match.node,
                    //       )}
                    //     />
                    //     // ============================================================== Multiple Models
                    //   ),
                    // }}
                  />
                </Col>

                <Col className="three-col">
                  {/* Patient Details */}
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'gender',
                      'race',
                      'age_at_diagnosis',
                      'age_at_sample_acquisition',
                      'disease_status',
                      'vital_status',
                      'neoadjuvant_therapy',
                      'therapy',
                      'chemotherapeutic_drugs',
                      'clinical_diagnosis.clinical_tumor_diagnosis',
                      'clinical_diagnosis.histological_type',
                      'primary_site',
                      'clinical_diagnosis.site_of_sample_acquisition',
                      'tissue_type',
                      'tnm_stage',
                      'clinical_diagnosis.clinical_stage_grouping',
                      'clinical_diagnosis.tumor_histological_grade',
                    ]}
                  />
                </Col>
              </Row>
            </section>,
            <section key="patient-details" className="model-section">
              <Row className="row">
                <Col className={modelImages ? 'three-col' : 'two-col'}>
                  {/* Repository Status */}
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'updatedAt',
                      'date_of_availability',
                      'licensing_required',
                      'createdAt',
                    ]}
                  />
                </Col>

                <Col className={modelImages ? 'three-col' : 'two-col'}>
                  {/* External Resources */}
                  <HorizontalTable
                    rawData={queryState.model}
                    extended={queryState.extended}
                    fieldNames={[
                      'source_model_url',
                      'source_sequence_url',
                      'somatic_maf_url',
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
                      somatic_maf_url: val =>
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
                    {/* Model Images */}
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
                            <img
                              src={
                                'https://hcmi-searchable-catalog.nci.nih.gov/api/data/images/5ed11d11dca0696d0801bb25'
                              }
                              alt={`File name: ${file_name}`}
                            />
                            {/* <img src={`${imgPath}/${file_id}`} alt={`File name: ${file_name}`} /> */}
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
                )}
              </Row>
            </section>,
            <section key="variants" className="model-section">
              <Col>
                {/* Variants */}
                <VariantTables modelName={modelName} />
              </Col>
            </section>,
          ]
        ) : (
          <Row justifyContent="center">
            <Spinner
              fadeIn="full"
              name="circle"
              style={{
                margin: 64,
                width: 48,
                height: 48,
                color: brandPrimary,
              }}
            />
          </Row>
        )}

        <ModelFooterBar name={modelName} />
      </div>
    )}
  </ModelQuery>
);
