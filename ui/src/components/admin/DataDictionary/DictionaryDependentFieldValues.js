import React, { useState } from 'react';

import DependentFieldValuesGroup from './DependentFieldValuesGroup';
import { useDictionary } from './DictionaryController';

import { CLINICAL_TUMOR_DIAGNOSIS, DEPENDENT_FIELD_KEYS } from './../helpers/dictionary';

import { HoverPill } from 'theme/adminControlsStyles';
import {
  DependentColumnHeading,
  DependentValues,
  DependentValuesHeader,
} from 'theme/adminDictionaryStyles';

const DictionaryDependentFieldValues = () => {
  const { activeField, activeValue, activeValueDependents } = useDictionary();

  const [expanded, setExpanded] = useState({
    [DEPENDENT_FIELD_KEYS.histologicalType]: true,
    [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: false,
    [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: false,
    [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: false,
  });
  const [shouldExpand, setShouldExpand] = useState(true);

  const expandAll = e => {
    e.preventDefault();
    setExpanded({
      [DEPENDENT_FIELD_KEYS.histologicalType]: true,
      [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: true,
      [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: true,
      [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: true,
    });
    setShouldExpand(false);
  };

  const collapseAll = e => {
    e.preventDefault();
    setExpanded({
      [DEPENDENT_FIELD_KEYS.histologicalType]: false,
      [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: false,
      [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: false,
      [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: false,
    });
    setShouldExpand(true);
  };

  const toggleExpanded = key => {
    setExpanded({
      ...expanded,
      [key]: !expanded[key],
    });
  };

  const getDependents = dependentKey => {
    if (!activeValue || !activeValueDependents) return [];

    let dependentsObj = activeValueDependents.find(x => x.name === dependentKey);

    if (dependentsObj && dependentsObj.values) {
      return dependentsObj.values.sort((a, b) => {
        if (a.value.toLowerCase() < b.value.toLowerCase()) return -1;
        if (a.value.toLowerCase() > b.value.toLowerCase()) return 1;
        return 0;
      });
    }

    return [];
  };

  return (
    activeField === CLINICAL_TUMOR_DIAGNOSIS &&
    activeValue &&
    activeValueDependents && (
      <DependentValues>
        <DependentValuesHeader>
          <DependentColumnHeading>Dependent Field Values for {activeValue}</DependentColumnHeading>
          <HoverPill
            secondary
            onClick={shouldExpand ? expandAll : collapseAll}
            css={`
              height: 28px;
            `}
          >
            {shouldExpand ? 'Expand All' : 'Collapse All'}
          </HoverPill>
        </DependentValuesHeader>

        <DependentFieldValuesGroup
          expanded={expanded[DEPENDENT_FIELD_KEYS.histologicalType]}
          fieldName={'Histological Subtype'}
          fieldKey={DEPENDENT_FIELD_KEYS.histologicalType}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.histologicalType)}
          toggleHandler={() => toggleExpanded(DEPENDENT_FIELD_KEYS.histologicalType)}
        />
        <DependentFieldValuesGroup
          expanded={expanded[DEPENDENT_FIELD_KEYS.clinicalStageGrouping]}
          fieldName={'Clinical Stage Grouping'}
          fieldKey={DEPENDENT_FIELD_KEYS.clinicalStageGrouping}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.clinicalStageGrouping)}
          toggleHandler={() => toggleExpanded(DEPENDENT_FIELD_KEYS.clinicalStageGrouping)}
        />
        <DependentFieldValuesGroup
          expanded={expanded[DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]}
          fieldName={'Histological Grade'}
          fieldKey={DEPENDENT_FIELD_KEYS.tumorHistologicalGrade}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.tumorHistologicalGrade)}
          toggleHandler={() => toggleExpanded(DEPENDENT_FIELD_KEYS.tumorHistologicalGrade)}
        />
        <DependentFieldValuesGroup
          expanded={expanded[DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]}
          fieldName={'Acquisition Site'}
          fieldKey={DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition}
          fieldValues={getDependents(DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition)}
          toggleHandler={() => toggleExpanded(DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition)}
        />
      </DependentValues>
    )
  );
};

export default DictionaryDependentFieldValues;
