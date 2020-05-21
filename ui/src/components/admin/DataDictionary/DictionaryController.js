import React, { useState, useContext } from 'react';
import moment from 'moment-timezone';

import { NotificationsContext } from './../Notifications';

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
    activeValueOriginal: '',
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

const getDictionaryErrorMessage = res => {
  return res.err ? res.err : 'Unknown error has occurred.';
};

export const useDictionary = () => {
  const [state, setState] = useContext(DictionaryContext);
  const { appendNotification } = useContext(NotificationsContext);

  const setActiveField = (fieldName, fieldSlug) => {
    setState({
      ...state,
      activeField: fieldName,
      activeFieldSlug: fieldSlug,
      activeValue: '',
      activeValueOriginal: '',
    });
  };

  const setActiveValue = (valueName, valueDependents, valueOriginal) => {
    setState({
      ...state,
      activeValue: valueName,
      activeValueDependents: valueDependents,
      activeValueOriginal: valueOriginal,
    });
  };

  const addField = (fieldName, fieldType = null) => {
    addDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: fieldType ? state.activeValueOriginal || state.activeValue : null,
      dependentName: fieldType,
      value: fieldName,
    }).then(response => {
      if (response.err) {
        appendNotification({
          type: 'error',
          message: 'Add Dictionary Field Error.',
          details: getDictionaryErrorMessage(response),
          timeout: false,
        });
      } else {
        setState({
          ...state,
          dictionary: response,
        });
      }
    });
  };

  const editField = async (original, updated, fieldType = null, isParent = false) => {
    const response = await editDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: fieldType ? state.activeValueOriginal || state.activeValue : null,
      dependentName: fieldType,
      original,
      updated,
    });

    if (response.err) {
      appendNotification({
        type: 'error',
        message: 'Edit Dictionary Field Error.',
        details: getDictionaryErrorMessage(response),
        timeout: false,
      });
    } else {
      if (isParent) {
        setState({
          ...state,
          dictionary: response,
          activeValue: updated,
          activeValueOriginal: original,
        });
      } else {
        setState({
          ...state,
          dictionary: response,
        });
      }
      return 'success';
    }
  };

  const removeField = (fieldName, fieldType = null) => {
    removeDictionaryDraftValue({
      field: state.activeFieldSlug,
      parent: fieldType ? state.activeValueOriginal || state.activeValue : null,
      dependentName: fieldType,
      value: fieldName,
    }).then(response => {
      if (response.err) {
        appendNotification({
          type: 'error',
          message: 'Remove Dictionary Field Error.',
          details: getDictionaryErrorMessage(response),
          timeout: false,
        });
      } else {
        setState({
          ...state,
          dictionary: response,
        });
      }
    });
  };

  const reset = () => {
    deleteDictionaryDraft().then(response => {
      if (response.err) {
        appendNotification({
          type: 'error',
          message: 'Reset Dictionary Draft Error.',
          details: getDictionaryErrorMessage(response),
          timeout: false,
        });
      } else {
        setState({
          ...state,
          dictionary: response,
          activeValue: '',
          activeValueDependents: [],
          activeValueOriginal: '',
        });
      }
    });
  };

  const publish = () => {
    publishDictionaryDraft().then(response => {
      if (response.err) {
        appendNotification({
          type: 'error',
          message: 'Publish Dictionary Draft Error.',
          details: getDictionaryErrorMessage(response),
          timeout: false,
        });
      } else {
        setState({
          ...state,
          dictionary: response,
        });
        appendNotification({
          type: 'success',
          message: `The data dictionary updates have been published and applied to ${
            response.updatedModels
          } model${response.updatedModels !== 1 ? 's' : ''}.`,
        });
      }
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
    reset,
    publish,
  };
};
