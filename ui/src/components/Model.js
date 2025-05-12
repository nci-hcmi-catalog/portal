import React from 'react';
import { css } from '@emotion/react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';

import ModelQuery from 'components/queries/ModelQuery';
import ModelBar from 'components/ModelBar';
import ModelCarouselBar from 'components/ModelCarouselBar';
import VariantTables from 'components/VariantTables';
import {
  ModelDetailsTooltip,
  MultipleModelsTooltip,
  MolecularCharacterizationsTooltip,
  PatientDetailsTooltip,
} from 'components/tooltips';

import AtccLogo from 'assets/atcc-logo.png';
import CameraIcon from 'icons/CameraIcon';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';
import ModelIcon from 'icons/ModelIcon';
import ShoppingCartIcon from 'icons/ShoppingCartIcon';
import CrossIcon from 'icons/CrossIcon';

import { VariantsProvider } from 'providers/Variants';

import { ExternalLinkPill } from 'theme/adminControlsStyles';
import { ModelSlider, ModelSlide, LeftArrow, RightArrow } from 'theme/carouselStyles';
import styles from 'theme/modelStyles';
import { Row, Col } from 'theme/system';
import base from 'theme';

import modelImageProcessor from 'utils/modelImageProcessor';
import apiDataProcessor from 'utils/apiDataProcessor';
import { distributorLink } from 'utils/externalReferences';

const {
  keyedPalette: { bombay, brandPrimary, pelorousapprox },
} = base;

const HorizontalTable = ({
  fieldNames = [],
  rawData,
  extended: fieldData = [],
  customUnits = {},
  customValue = {},
}) => {
  const fieldHelper = (acc, { field, type, displayName, unit }) =>
    fieldNames.includes(field)
      ? {
          ...acc,
          [field]: {
            key: displayName,
            value: apiDataProcessor({ data: get(rawData, field), type, unit }),
          },
        }
      : acc;

  const formattedData = fieldData
    .slice()
    .sort((a, b) => fieldNames.indexOf(a.fieldName) - fieldNames.indexOf(b.fieldName))
    .reduce((acc, { fieldName, type, displayName, unit }) => {
      return !Object.keys(customUnits).includes(fieldName)
        ? fieldHelper(acc, { field: fieldName, type, displayName, unit })
        : fieldHelper(acc, {
            field: fieldName,
            type,
            displayName,
            unit: customUnits[fieldName] || unit,
          });
    }, {});

  return (
    <table className="entity-horizontal-table" cellPadding="0" cellSpacing="0">
      <tbody>
        {Object.keys(formattedData).map((field) => {
          const { key, value } = formattedData[field];
          return (
            <tr key={key}>
              <td className="heading">{key}</td>
              <td className="content">
                {Object.keys(customValue).includes(field) ? (
                  customValue[field](value)
                ) : Array.isArray(value) ? (
                  <ul>
                    {value.map((val, idx) => (
                      <li key={idx}>{`• ${val}`}</li>
                    ))}
                  </ul>
                ) : (
                  value
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const MultipleModelContent = (match) => {
  return (
    <div className="multiple-models__model" key={match.name}>
      <div className="multiple-models__model-icon">
        <ModelIcon />
      </div>
      <div className="multiple-models__model-text">
        <Link
          className="model-text__name"
          to={{
            pathname: `/model/${match.name}`,
          }}
        >
          {match.name}
        </Link>
        <span className="model-text__type">
          Tissue Status: <strong>{match.tissue_type || 'N/A'}</strong>
        </span>
      </div>
    </div>
  );
};

const MultipleModelsList = ({ matches }) => {
  if (matches.length > 0) {
    return <div className="multiple-models">{matches.map(MultipleModelContent)}</div>;
  } else {
    return (
      <div className="model-details model-details--empty">
        <ModelIcon fill={bombay} />
        <p className="model-details__empty-message">There are no other models from this patient.</p>
      </div>
    );
  }
};

const MolecularCharacterizationsCell = ({ isAvailable }) => {
  return isAvailable ? (
    <CheckmarkIcon
      width={'18px'}
      height={'18px'}
      css={css`
        background-color: ${pelorousapprox};
        border-radius: 100%;
        padding: 4px;
      `}
      title="Available"
    />
  ) : (
    <CrossIcon
      width={'18px'}
      height={'18px'}
      title="Not Available"
      css={css`
        padding: 4px;
      `}
    />
  );
};

const MolecularCharacterizationsTable = ({ characterizations }) => {
  const CHARS = process.env.REACT_APP_ENABLE_PROTEOMICS
    ? ['WGS', 'WXS', 'RNA-seq', 'DNA Methylation', 'Proteomics']
    : ['WGS', 'WXS', 'RNA-seq', 'DNA Methylation'];
  const TYPES = ['model', 'parent tumor', 'normal'];

  return (
    <table className="molecular-characterizations-table">
      <tbody>
        <tr>
          <td />
          <th>Model</th>
          <th>Tumor</th>
          <th>Normal</th>
        </tr>
        {CHARS.map((characterization) => (
          <tr key={characterization}>
            <th>{characterization}</th>
            {TYPES.map((type) => (
              <td key={`${characterization} of ${type}`}>
                <MolecularCharacterizationsCell
                  isAvailable={characterizations.includes(`${characterization} of ${type}`)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ExternalResourceLink = ({ url, children }) =>
  url ? (
    <ExternalLinkPill
      primary
      className={`external-resources__link ${!url && 'external-resources__link--disabled'}`}
      href={url}
      role={!url ? 'button' : null}
      disabled={!url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </ExternalLinkPill>
  ) : null;

const ExternalResourcesContent = ({
  distributorPartNumber,
  proteomicsUrl,
  somaticMafUrl,
  sourceModelUrl,
  sourceSequenceUrl,
}) => {
  const distributorLinkUrl = distributorPartNumber ? distributorLink(distributorPartNumber) : null;
  const modelSourceLink = sourceModelUrl !== 'N/A' ? sourceModelUrl : null;
  const proteomicsLink = proteomicsUrl !== 'N/A' ? proteomicsUrl : null;
  const sequencingFilesLink = sourceSequenceUrl !== 'N/A' ? sourceSequenceUrl : null;
  const somaticMafLink = somaticMafUrl !== 'N/A' ? somaticMafUrl : null;
  const hasExternalResources =
    distributorLinkUrl ||
    modelSourceLink ||
    sequencingFilesLink ||
    somaticMafLink ||
    (process.env.REACT_APP_ENABLE_PROTEOMICS && proteomicsLink);

  return (
    <div className="external-resources">
      {!hasExternalResources ? (
        <div className="model-details model-details--empty">
          {/* Manually adding a circle around this icon for the empty state */}
          <div
            css={css`
              width: 30px;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #b2b7c1;
              border-radius: 50%;
              margin-right: 5px;
            `}
          >
            <ExternalLinkIcon
              fill={bombay}
              width={'14px'}
              height={'14px'}
              css={css`
                margin: 0;
              `}
            />
          </div>
          <p className="model-details__empty-message">No external resources available.</p>
        </div>
      ) : (
        <>
          <ExternalResourceLink url={sequencingFilesLink}>
            <ExternalLinkIcon />
            Sequencing Files
          </ExternalResourceLink>
          <ExternalResourceLink url={modelSourceLink}>
            <ExternalLinkIcon />
            Case Metadata
          </ExternalResourceLink>
          {process.env.REACT_APP_ENABLE_PROTEOMICS && (
            <ExternalResourceLink url={proteomicsLink}>
              <ExternalLinkIcon />
              Proteomics Data
            </ExternalResourceLink>
          )}
          <ExternalResourceLink url={somaticMafLink}>
            <ExternalLinkIcon />
            Masked Somatic MAF
          </ExternalResourceLink>
          <ExternalResourceLink url={distributorLinkUrl}>
            <ShoppingCartIcon />
            <ExternalLinkIcon />
            Visit {distributorPartNumber} to Purchase
          </ExternalResourceLink>
        </>
      )}
    </div>
  );
};

const Model = ({ modelName }) => (
  <ModelQuery modelName={modelName}>
    {({
      state: queryState,
      modelImages = modelImageProcessor(
        queryState.model && queryState.model.files && queryState.model.files.hits
          ? queryState.model.files.hits.edges
          : [],
      ),
    }) => (
      <main id="main" css={styles}>
        <ModelBar
          name={modelName}
          id={(queryState.model || { id: '' }).id}
          isExpanded={queryState.model ? queryState.model.expanded : null}
        />
        <ModelCarouselBar name={modelName} className="model-carousel-bar--top" />
        {queryState.model ? (
          <>
            <section key="model-details" className="model-section">
              <Row className="row">
                <Col className="three-col">
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Model Details</h3>
                    <ModelDetailsTooltip />
                    <HorizontalTable
                      rawData={queryState.model}
                      extended={queryState.extended}
                      fieldNames={[
                        'type',
                        'split_ratio',
                        'time_to_split',
                        'growth_rate',
                        'tissue_type',
                      ]}
                      customUnits={{ growth_rate: ' days' }}
                    />
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Multiple Models From This Patient (
                      {queryState.model.matched_models.hits.edges.length || '0'})
                    </h3>
                    <MultipleModelsTooltip />
                    <MultipleModelsList
                      matches={queryState.model.matched_models.hits.edges.map(
                        (match) => match.node,
                      )}
                    />
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Available Molecular Characterizations (
                      {get(queryState.model, 'molecular_characterizations').length || '0'})
                    </h3>
                    <MolecularCharacterizationsTooltip />
                    <MolecularCharacterizationsTable
                      characterizations={get(queryState.model, 'molecular_characterizations')}
                    />
                  </div>
                </Col>

                <Col className="three-col">
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Patient Details</h3>
                    <PatientDetailsTooltip />
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
                  </div>
                </Col>

                <Col className="three-col">
                  {!queryState.model.expanded && (
                    <div className="model-section__card model-section__card--callout">
                      <div className="model-section__card-description--with-image">
                        This is an unexpanded model, which means it has passed sequencing validation
                        quality control, but is not yet available for purchase.
                        <img src={AtccLogo} className="model-section__card-logo" alt="ATCC Logo" />
                      </div>
                      <div>
                        <p className="model-section__card-instruction">
                          If you would like to have this model prioritized for development:
                        </p>
                        <ExternalLinkPill
                          primary
                          className="model-section__callout-button"
                          href="https://www.atcc.org/hcmi-input"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon />
                          Visit ATCC to Express Interest
                        </ExternalLinkPill>
                      </div>
                    </div>
                  )}
                  <div className="model-section__card">
                    <h3 className="model-section__card-title">
                      Model Images ({(modelImages && modelImages.length) || '0'})
                    </h3>
                    {modelImages && modelImages.length ? (
                      <ModelSlider
                        LeftArrow={<LeftArrow aria-label="Previous image" />}
                        RightArrow={<RightArrow aria-label="Next image" />}
                        autoSlide={false}
                        showDots={false}
                        cardsToShow={1}
                        // adding a key to force re-render of the slider
                        // ensures arrow buttons are present when needed
                        key={`model-slider-${modelImages.length}`}
                      >
                        {modelImages.map(
                          ({
                            file_id,
                            file_url,
                            file_name,
                            scale_bar_length,
                            magnification,
                            passage_number,
                          }) => (
                            <ModelSlide key={file_id}>
                              <img src={file_url} alt={`File name: ${file_name}`} />
                              {(scale_bar_length || magnification || passage_number) && (
                                <div
                                  css={css`
                                    text-align: center;
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
                    ) : (
                      <div className="model-details model-details--empty">
                        <CameraIcon fill={bombay} />
                        <p className="model-details__empty-message">No images available.</p>
                      </div>
                    )}
                  </div>

                  <div className="model-section__card">
                    <h3 className="model-section__card-title">Repository Status</h3>
                    <HorizontalTable
                      rawData={queryState.model}
                      extended={queryState.extended}
                      fieldNames={
                        queryState.model.expanded
                          ? ['updatedAt', 'date_of_availability', 'licensing_required', 'createdAt']
                          : ['updatedAt', 'createdAt']
                      }
                    />
                  </div>

                  {queryState.model.expanded && (
                    <div className="model-section__card">
                      <h3 className="model-section__card-title">External Resources</h3>
                      <ExternalResourcesContent
                        distributorPartNumber={get(queryState.model, 'distributor_part_number')}
                        proteomicsUrl={get(queryState.model, 'proteomics_url')}
                        sourceModelUrl={get(queryState.model, 'source_model_url')}
                        sourceSequenceUrl={get(queryState.model, 'source_sequence_url')}
                        somaticMafUrl={get(queryState.model, 'somatic_maf_url')}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </section>

            <section key="variants" className="model-section">
              <Col>
                <div className="model-section__card">
                  <h3 className="model-section__card-title">Variants</h3>
                  <VariantsProvider>
                    <VariantTables modelName={modelName} />
                  </VariantsProvider>
                </div>
              </Col>
            </section>
          </>
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

        <ModelCarouselBar name={modelName} className="model-carousel-bar--bottom" />
      </main>
    )}
  </ModelQuery>
);

export default Model;
