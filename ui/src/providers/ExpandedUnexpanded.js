import React, { useContext, useState } from 'react';

const SHOW_UNEXPANDED_KEY = 'show-unexpanded';

export const ExpandedUnexpandedContext = React.createContext([{}, () => {}]);

export const ExpandedUnexpandedProvider = props => {
  const [showUnexpanded, setShowUnexpanded] = useState(
    JSON.parse(localStorage.getItem(SHOW_UNEXPANDED_KEY)) || false,
  );

  return (
    <ExpandedUnexpandedContext.Provider value={[[showUnexpanded, setShowUnexpanded]]}>
      {props.children}
    </ExpandedUnexpandedContext.Provider>
  );
};

export const useExpandedUnexpanded = () => {
  const [[showUnexpanded, setShowUnexpanded]] = useContext(ExpandedUnexpandedContext);

  const get = () => {
    if (typeof JSON.parse(localStorage.getItem(SHOW_UNEXPANDED_KEY)) === 'undefined') {
      localStorage.setItem(SHOW_UNEXPANDED_KEY, false);
    }

    if (typeof showUnexpanded === 'undefined') {
      setShowUnexpanded(false);
    }

    return JSON.parse(localStorage.getItem(SHOW_UNEXPANDED_KEY));
  };

  const set = val => {
    setShowUnexpanded(val);
    localStorage.setItem(SHOW_UNEXPANDED_KEY, val);
  };

  const clear = () => {
    setShowUnexpanded(undefined);
    localStorage.removeItem(SHOW_UNEXPANDED_KEY);
  };

  return {
    showUnexpanded: get(),
    setShowUnexpanded: set,
    clearShowUnexpanded: clear,
  };
};
