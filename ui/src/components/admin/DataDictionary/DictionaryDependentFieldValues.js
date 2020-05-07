import React, { useState } from 'react';

import DependentFieldValuesGroup from './DependentFieldValuesGroup';
import { useDictionary } from './DictionaryController';

import { HoverPill } from 'theme/adminControlsStyles';
import {
  DependentValues,
  DependentValuesHeader,
  DictionaryColumnHeading,
  expandPill,
} from 'theme/adminDictionaryStyles';

const DEPENDENT_FIELD_KEYS = {
  histologicalType: 'histological type',
  clinicalStageGrouping: 'clinical stage grouping',
  siteOfSampleAcquisition: 'site of sample acquisition',
  tumorHistologicalGrade: 'tumor histological grade',
};

const DictionaryDependentFieldValues = () => {
  const { activeValue, activeValueDependents } = useDictionary();

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
    activeValue &&
    activeValueDependents && (
      <DependentValues>
        <DependentValuesHeader>
          <DictionaryColumnHeading>Dependent Field Values</DictionaryColumnHeading>
          <HoverPill primary css={expandPill} onClick={expandAll}>
            Expand All
          </HoverPill>
        </DependentValuesHeader>

        {/* This is the ideal way to do it, however it fails in the case there are no dependents
            since there is no way to add any */}
        {/* {activeValueDependents.map(dependentGroup => (
          <DependentFieldValuesGroup
            key={dependentGroup.name}
            fieldName={dependentGroup.displayName}
            fieldValues={dependentGroup.values}
            fieldKey={dependentGroup.name}
          />
        ))} */}

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
