import React from 'react';
import InfoTooltip from './InfoTooltip';

import { TooltipLink } from 'theme/modelStyles';

const resetIconPositionStyle = `position: relative; top: unset; right: unset; margin-bottom: auto;`;
const resetFacetIconPositionStyle = `
  ${resetIconPositionStyle}
  margin: auto 0 auto 5px;
`;

export const ModelDetailsTooltip = () => (
  <InfoTooltip
    ariaLabel={
      'Model details are provided by the model distributor. We aim to collect as complete data as possible, but it is not always feasible to obtain all data.'
    }
  >
    <b>Model details</b> are provided by the model distributor. We aim to collect as complete data
    as possible, but it is not always feasible to obtain all data.
  </InfoTooltip>
);

export const MultipleModelsTooltip = ({ isColumn = false, isFacet = false, width = null }) => (
  <InfoTooltip
    ariaLabel={
      'In some cases, it is possible to create models from more than one tumor site from a single patient. These Multiple Models for a single patient are associated with each other.'
    }
    position={isColumn || isFacet ? 'bottom right' : undefined}
    iconStyle={
      isColumn ? resetIconPositionStyle : isFacet ? resetFacetIconPositionStyle : undefined
    }
    width={width ? width : undefined}
  >
    In some cases, it is possible to create models from more than one tumor site from a single
    patient. These <b>Multiple Models</b> for a single patient are associated with each other.
  </InfoTooltip>
);

export const MolecularCharacterizationsTooltip = ({
  isColumn = false,
  isFacet = false,
  width = null,
}) => (
  <InfoTooltip
    ariaLabel={
      'QC’ed data are released as they complete the characterization pipeline. Available data types may differ among Cancer Model Development Centers.'
    }
    position={isColumn || isFacet ? 'bottom right' : undefined}
    iconStyle={
      isColumn ? resetIconPositionStyle : isFacet ? resetFacetIconPositionStyle : undefined
    }
    width={width ? width : undefined}
  >
    QC’ed data are released as they complete the characterization pipeline.{' '}
    <b> Available data types</b> may differ among Cancer Model Development Centers.
  </InfoTooltip>
);

export const PatientDetailsTooltip = () => (
  <InfoTooltip
    ariaLabel={
      'Patient details are reported from case report forms. The availability of clinical data may differ among Cancer Model Development Centers.'
    }
  >
    <b>Patient details</b> are reported from{' '}
    <TooltipLink
      target="_blank"
      rel="noopener noreferrer"
      href="https://ocg.cancer.gov/programs/hcmi/resources"
    >
      case report forms
    </TooltipLink>
    . The availability of clinical data may differ among Cancer Model Development Centers.
  </InfoTooltip>
);

export const ClinicalVariantsTooltip = () => (
  <InfoTooltip
    ariaLabel={
      'Variants are identified through clinical sequencing testing procedures as reported in the case report forms.'
    }
    position="bottom right"
    iconStyle={resetIconPositionStyle}
  >
    <b>Variants</b> are identified through clinical sequencing testing procedures as reported in the{' '}
    <TooltipLink
      target="_blank"
      rel="noopener noreferrer"
      href="https://ocg.cancer.gov/programs/hcmi/resources"
    >
      case report forms
    </TooltipLink>
    .
  </InfoTooltip>
);

export const HistopathologicalBiomarkersTooltip = () => (
  <InfoTooltip
    ariaLabel={
      'Biomarkers are identified through clinical histopathology testing procedures as reported in the case report forms.'
    }
    position="bottom right"
    iconStyle={resetIconPositionStyle}
  >
    <b>Biomarkers</b> are identified through clinical histopathology testing procedures as reported
    in the{' '}
    <TooltipLink
      target="_blank"
      rel="noopener noreferrer"
      href="https://ocg.cancer.gov/programs/hcmi/resources"
    >
      case report forms
    </TooltipLink>
    .
  </InfoTooltip>
);

export const GenomicVariantsTooltip = ({ isFacet = false, width = null }) => (
  <InfoTooltip
    ariaLabel={
      'Variants are imported from GDC and are identified from filtered, open-access MAFs. Controlled-access data at GDC requires dbGaP approval; see GDC for details.'
    }
    position="bottom right"
    iconStyle={isFacet ? resetFacetIconPositionStyle : resetIconPositionStyle}
    width={width ? width : undefined}
  >
    <b>Variants</b> are imported from GDC and are identified from filtered, open-access MAFs.
    Controlled-access data at GDC requires dbGaP approval;{' '}
    <TooltipLink
      target="_blank"
      rel="noopener noreferrer"
      href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
    >
      see GDC
    </TooltipLink>{' '}
    for details.
  </InfoTooltip>
);

export const ExpansionStatusTooltip = () => (
  <InfoTooltip
    ariaLabel={
      'Expanded models are available for purchase on ATCC. Unexpanded models have passed sequencing validation QC, but are not yet available for purchase.'
    }
    position="bottom right"
    iconStyle={resetIconPositionStyle}
  >
    <b>Expanded models</b> are available for purchase on ATCC.
    <br />
    <b>Unexpanded models</b> have passed sequencing validation QC, but are not yet available for
    purchase.
  </InfoTooltip>
);
