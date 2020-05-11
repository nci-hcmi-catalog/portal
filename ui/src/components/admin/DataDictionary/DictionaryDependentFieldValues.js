import React, { useState } from 'react';

import DependentFieldValuesGroup from './DependentFieldValuesGroup';
import { useDictionary } from './DictionaryController';

import { CLINICAL_TUMOR_DIAGNOSIS, DEPENDENT_FIELD_KEYS } from './../helpers/dictionary';

import { HoverPill } from 'theme/adminControlsStyles';
import {
  DependentValues,
  DependentValuesHeader,
  DictionaryColumnHeading,
  expandPill,
} from 'theme/adminDictionaryStyles';

const DictionaryDependentFieldValues = () => {
  const { activeField, activeValue, activeValueDependents } = useDictionary();

  const [expanded, setExpanded] = useState({
    [DEPENDENT_FIELD_KEYS.histologicalType]: true,
    [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: false,
    [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: false,
    [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: false,
  });

  const expandAll = e => {
    e.preventDefault();
    setExpanded({
      [DEPENDENT_FIELD_KEYS.histologicalType]: true,
      [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: true,
      [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: true,
      [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: true,
    });
    console.log('Data Dictionary: Expand All');
  };

  const getDependents = dependentKey => {
    if (!activeValue || !activeValueDependents) return [];

    let dependentsObj = activeValueDependents.find(x => x.name === dependentKey);

    if (dependentsObj && dependentsObj.values) {
      return dependentsObj.values;
    }

    return [];
  };

  return (
    activeField === CLINICAL_TUMOR_DIAGNOSIS &&
    activeValue && (
      <DependentValues>
        <DependentValuesHeader>
          <DictionaryColumnHeading>Dependent Field Values</DictionaryColumnHeading>
          <HoverPill primary css={expandPill} onClick={expandAll}>
            Expand All
          </HoverPill>
        </DependentValuesHeader>

        <DependentFieldValuesGroup
          fieldName={'Histological Subtype'}
          fieldKey={DEPENDENT_FIELD_KEYS.histologicalType}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.histologicalType)}
          isOpen={expanded[DEPENDENT_FIELD_KEYS.histologicalType]}
        />
        <DependentFieldValuesGroup
          fieldName={'Clinical Stage Grouping'}
          fieldKey={DEPENDENT_FIELD_KEYS.clinicalStageGrouping}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.clinicalStageGrouping)}
          isOpen={expanded[DEPENDENT_FIELD_KEYS.clinicalStageGrouping]}
        />
        <DependentFieldValuesGroup
          fieldName={'Histological Grade'}
          fieldKey={DEPENDENT_FIELD_KEYS.tumorHistologicalGrade}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.tumorHistologicalGrade)}
          isOpen={expanded[DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]}
        />
        <DependentFieldValuesGroup
          fieldName={'Acquisition Site'}
          fieldKey={DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition)}
          isOpen={expanded[DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]}
        />
      </DependentValues>
    )
  );
};

export default DictionaryDependentFieldValues;