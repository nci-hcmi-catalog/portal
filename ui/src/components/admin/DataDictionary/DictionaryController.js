import React, { useState, useContext } from 'react';
import moment from 'moment-timezone';

import {
  addDictionaryDraftValue,
  deleteDictionaryDraft,
  editDictionaryDraftValue,
  publishDictionaryDraft,
  removeDictionaryDraftValue,
} from './../helpers/dictionary';

export const DictionaryContext = React.createContext([{}, () => {}]);

export const DictionaryProvider = props => {
  const [state, setState] = useState({
    dictionary: {},
    activeField: '',
    activeFieldSlug: '',
    activeFieldValues: [],
    activeValue: '',
    activeValueDependents: [],
    totalEdits: 0,
    totalNew: 0,
    lastPublished: '',
    lastUpdated: '',
    isDraft: false,
  });
  return (
    <DictionaryContext.Provider value={[state, setState]}>
      {props.children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);

  const setActiveField = (fieldName, fieldSlug) => {
    setState({
      ...state,
      activeField: fieldName,
      activeFieldSlug: fieldSlug,
      activeValue: '',
    });
  };

  const setActiveValue = (valueName, valueDependents) => {
    setState({
      ...state,
      activeValue: valueName,
      activeValueDependents: valueDependents,
    });
  };

  const addField = fieldName => {
    addDictionaryDraftValue({
      field: state.activeFieldSlug,
      value: fieldName,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const editField = (original, updated) => {
    editDictionaryDraftValue({
      field: state.activeFieldSlug,
      original,
      updated,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const removeField = fieldName => {
    removeDictionaryDraftValue({
      field: state.activeFieldSlug,
      value: fieldName,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const addDependentField = (fieldName, fieldType) => {
    addDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: state.activeValue,
      dependentName: fieldType,
      value: fieldName,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const editDependentField = (original, updated, fieldType) => {
    editDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: state.activeValue,
      dependentName: fieldType,
      original,
      updated,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const removeDependentField = (fieldName, fieldType) => {
    removeDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: state.activeValue,
      dependentName: fieldType,
      value: fieldName,
    }).then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const reset = () => {
    deleteDictionaryDraft().then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const publish = () => {
    publishDictionaryDraft().then(updatedDictionary => {
      setState({
        ...state,
        dictionary: updatedDictionary,
      });
    });
  };

  const getActiveFieldValues = () => {
    if (
      state.activeField &&
      state.dictionary &&
      state.dictionary.fields &&
      state.dictionary.fields.length > 0
    ) {
      let fieldObj = state.dictionary.fields.find(x => x.displayName === state.activeField);
      if (fieldObj) {
        return fieldObj.values.sort((a, b) => {
          if (a.value.toLowerCase() < b.value.toLowerCase()) return -1;
          if (a.value.toLowerCase() > b.value.toLowerCase()) return 1;
          return 0;
        });
      }
    }

    return [];
  };

  const getActiveValueDependents = () => {
    let activeFieldValues = getActiveFieldValues();

    if (activeFieldValues && activeFieldValues.length > 0) {
      let fieldObj = activeFieldValues.find(x => x.value === state.activeValue);
      if (fieldObj) {
        return fieldObj.dependents;
      }
    }

    return [];
  };

  const getTotalEdits = () => {
    let totalEdits = 0;

    if (state.dictionary && state.dictionary.fields) {
      state.dictionary.fields.forEach(field => {
        if (field.stats && field.stats.edited) {
          totalEdits += field.stats.edited;
        }
      });
    }

    return totalEdits;
  };

  const getTotalNew = () => {
    let totalNew = 0;

    if (state.dictionary && state.dictionary.fields) {
      state.dictionary.fields.forEach(field => {
        if (field.stats && field.stats.new) {
          totalNew += field.stats.new;
        }
      });
    }

    return totalNew;
  };

  const getLastPublished = () => {
    if (!state || !state.dictionary || !state.dictionary.created_at) return null;
    return moment
      .utc(state.dictionary.created_at)
      .local()
      .format('MMM DD, YYYY');
  };

  const getLastUpdated = () => {
    if (!state || !state.dictionary || !state.dictionary.updated_at) return null;
    return moment
      .utc(state.dictionary.updated_at)
      .local()
      .format('MMM DD, YYYY h:mm a');
  };

  return {
    activeField: state.activeField,
    activeFieldValues: getActiveFieldValues(),
    activeValue: state.activeValue,
    activeValueDependents: getActiveValueDependents(),
    dictionary: state.dictionary,
    isDraft: state.dictionary.created_at !== state.dictionary.updated_at,
    lastPublished: getLastPublished(),
    lastUpdated: getLastUpdated(),
    totalEdits: getTotalEdits(),
    totalNew: getTotalNew(),
    setActiveField,
    setActiveValue,
    addField,
    editField,
    removeField,
    addDependentField,
    editDependentField,
    removeDependentField,
    reset,
    publish,
  };
};
