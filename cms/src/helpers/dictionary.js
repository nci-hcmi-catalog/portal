import Dictionary from '../schemas/dictionary';
import Draft, { draftStatus } from '../schemas/dictionaryDraft';
import Model from '../schemas/model';
import { modelStatus } from '../helpers/modelStatus';

const fieldNameToModelPropertyMap = {
  primarySites: 'primary_site',
  modelType: 'type',
  splitRatio: 'split_ratio',
  gender: 'gender',
  race: 'race',
  neoadjuvantTherapy: 'neoadjuvant_therapy',
  diseaseStatus: 'disease_status',
  vitalStatus: 'vital_status',
  tissueTypes: 'tissue_type',
  clinicalTumorDiagnosis: 'clinical_tumor_diagnosis',
  'histological type': 'histological_type',
  'clinical stage grouping': 'clinical_stage_grouping',
  'site of sample acquisition': 'site_of_sample_acquisition',
  'tumor histological grade': 'tumor_histological_grade',
};

export const getDictionary = async () =>
  await Dictionary.findOne({}, {}, { sort: { created_at: -1 } });

export const getDictionaryDraft = async () =>
  await Draft.findOne({}, {}, { sort: { created_at: -1 } });

export const getDictionaryOptions = async () => {
  const result = await getDictionary();
  const dictionary = result.fields;

  const output = dictionary.reduce((acc, field) => {
    let { name, values } = field;
    acc[`${name}Options`] = values.map(i => i.value);
    return acc;
  }, {});
  const ctd = dictionary.find(i => i.name === 'clinicalTumorDiagnosis');

  const ctdDependentOptions = {};

  ctd.dependentValues.forEach(val => (ctdDependentOptions[val] = {}));

  ctd.values.forEach(val => {
    const valueName = val.value;

    val.dependents.forEach(dependent => {
      const dependentName = dependent.name;
      const dependentValues = dependent.values.map(val => val.value);

      ctdDependentOptions[dependentName][valueName.toLowerCase()] = dependentValues;
    });
  });
  output.clinicalTumorDiagnosisDependent = ctdDependentOptions;

  return output;
};

export const resetDraft = async () => {
  const dictionary = await Dictionary.findOne({}, {}, { sort: { created_at: -1 } });
  const draft = new Draft({ fields: dictionary.fields });
  await draft.save();
  return await Draft.findOne({}, {}, { sort: { created_at: -1 } });
};

/**
 * Publishes the currently saved draft to the dictionary
 * Return object includes the number of models updated
 */
export const publishDraft = async () => {
  const draft = await getDictionaryDraft();

  // find edited values
  const edits = [];
  draft.fields.forEach(field => {
    if (field.dependentValues.length > 0) {
      // dependent field case
      field.values.forEach(value => {
        value.dependents.forEach(dependent => {
          dependent.values.forEach(dependentValue => {
            if (dependentValue.status === draftStatus.edited) {
              edits.push({
                field: field.name,
                parent: value.value,
                dependentName: dependent.name,
                value: dependentValue.value,
                original: dependentValue.original,
              });
            }
          });
        });
      });
    }
    // basic field case
    field.values.forEach(value => {
      if (value.status === draftStatus.edited) {
        edits.push({
          field: field.name,
          value: value.value,
          original: value.original,
        });
      }
    });
  });

  // TODO: do this in batches.
  //       As written, it will load all models from mongo at same time.
  //       This is fine today, but if we get too many models in the system
  //       then this will take too much memory to be feasible.

  let updatedModels = 0;

  const models = await Model.find({});

  const dictionary = new Dictionary({ fields: draft.fields });
  await dictionary.save();

  models.forEach(model => {
    // Find these values in the models.
    let edited = false;
    edits.forEach(edit => {
      const editField = edit.dependentName ? edit.dependentName : edit.field;

      // - update those models and change their status
      if (editField === 'therapy' && model.therapy.includes(edit.original)) {
        // special case, therapy is an array

        model.therapy.splice(model.therapy.indexOf(val => val === edit.original), 1);
        model.therapy.push(edit.value);
        model.status =
          model.status === modelStatus.published ? modelStatus.unpublishedChanges : model.status;
        edited = true;
      } else {
        const modelField = fieldNameToModelPropertyMap[editField];
        if (model[modelField] === edit.original) {
          model[modelField] = edit.value;
          model.status =
            model.status === modelStatus.published ? modelStatus.unpublishedChanges : model.status;
          edited = true;
        }
      }
    });
    model.save();
    if (edited) {
      updatedModels += 1;
    }
  });

  return { dictionary, updatedModels };
};

export const countDraftStats = draft => {
  const output = { edited: 0, new: 0 };

  const hasDependencies = draft.dependentValues && draft.dependentValues.length > 0;
  for (let value of draft.values) {
    if (value.status === draftStatus.edited) {
      output.edited += 1;
    }
    if (value.status === draftStatus.new) {
      output.new += 1;
    }

    if (hasDependencies) {
      for (let dependent of value.dependents) {
        // Ensure we are only looking for edits in dependcies that are listed in the draft.dependentValues list
        if (draft.dependentValues.includes(dependent.name)) {
          for (let dependentValue of dependent.values) {
            if (dependentValue.status == draftStatus.edited) {
              output.edited += 1;
            }
            if (dependentValue.status == draftStatus.new) {
              output.new += 1;
            }
          }
        }
      }
    }
  }
  return output;
};

export const editValue = (target, original, updated) => {
  target.value = updated;
  if (target.status !== draftStatus.new) {
    // Editing an existing value - New values shouldn't get original property or change status
    target.original = target.original ? target.original : original;

    target.status = target.value === original ? draftStatus.published : draftStatus.edited;
  }
};

export const valueExists = (valuesList, value) => {
  return !!valuesList.find(val => val.value === value);
};

export const removeValueIfNew = (valueList, value) => {
  const index = valueList.indexOf(
    valueList.find(i => i.status === draftStatus.new && i.value === value),
  );
  if (index >= 0) {
    valueList.splice(index, 1);
  } else {
    throw new Error(`Could not find this ${value} with 'new' status in list.`);
  }
};
