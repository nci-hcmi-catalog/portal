import React, { useState, useContext } from 'react';

export const DictionaryContext = React.createContext([{}, () => {}]);

export const DictionaryProvider = props => {
  const [state, setState] = useState({
    dictionary: {},
    activeField: '',
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

  const setActiveField = fieldName => {
    setState({
      ...state,
      activeField: fieldName,
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
    // TODO: implement using API
    setState({
      ...state,
      dictionary: {
        ...state.dictionary,
        fields: state.dictionary.fields.map(x =>
          x.displayName === state.activeField
            ? {
                ...x,
                values: [...x.values, { value: fieldName, dependents: [], status: 'new' }].sort(
                  (a, b) => {
                    if (a.value < b.value) return -1;
                    if (a.value > b.value) return 1;
                    return 0;
                  },
                ),
              }
            : x,
        ),
      },
    });
  };

  const removeField = fieldName => {
    // TODO: implement using API
    setState({
      ...state,
      dictionary: {
        ...state.dictionary,
        fields: state.dictionary.fields.map(x =>
          x.displayName === state.activeField
            ? { ...x, values: x.values.filter(y => y.value !== fieldName) }
            : x,
        ),
      },
    });
  };

  const addDependentField = (fieldName, fieldType) => {
    // TODO: FIX THIS... and/or switch to API
    setState({
      ...state,
      dictionary: {
        ...state.dictionary,
        fields: state.dictionary.fields.map(x =>
          x.displayName === state.activeField
            ? {
                ...x,
                values: state.activeFieldValues.map(y =>
                  y.value === state.activeValue
                    ? {
                        ...y,
                        dependents: state.activeValueDependents.map(z =>
                          z.name === fieldType
                            ? {
                                ...z,
                                values: [
                                  ...z.values,
                                  { value: fieldName, dependents: [], status: 'new' },
                                ].sort((a, b) => {
                                  if (a.value < b.value) return -1;
                                  if (a.value > b.value) return 1;
                                  return 0;
                                }),
                              }
                            : z,
                        ),
                      }
                    : y,
                ),
              }
            : x,
        ),
      },
    });
  };

  const removeDependentField = (fieldName, fieldType) => {
    // TODO: FIX THIS... and/or switch to API
    setState({
      ...state,
      dictionary: {
        ...state.dictionary,
        fields: state.dictionary.fields.map(x =>
          x.displayName === state.activeField
            ? {
                ...x,
                values: state.activeFieldValues.map(y =>
                  y.value === state.activeValue
                    ? {
                        ...y,
                        dependents: state.activeValueDependents.map(z =>
                          z.name === fieldType
                            ? {
                                ...z,
                                values: z.values.filter(a => a.value !== fieldName),
                              }
                            : z,
                        ),
                      }
                    : y,
                ),
              }
            : x,
        ),
      },
    });
  };

  const reset = () => {
    // TODO: implement reset draft functionality
    console.log('Data Dictionary: Reset Draft');
  };

  const publish = () => {
    // TODO: implement publish draft functionality
    console.log('Data Dictionary: Publish All Updates');
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
        return fieldObj.values;
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

  return {
    activeField: state.activeField,
    activeFieldValues: getActiveFieldValues(),
    activeValue: state.activeValue,
    activeValueDependents: getActiveValueDependents(),
    dictionary: state.dictionary,
    isDraft: state.isDraft,
    setActiveField,
    setActiveValue,
    addField,
    removeField,
    addDependentField,
    removeDependentField,
    reset,
    publish,
  };
};
