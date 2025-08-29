import React, { useState } from 'react';

export const ModalStateContext = React.createContext();

const ModalStateProvider = ({ children }) => {
  const [state, setState] = useState({
    component: null,
  });

  return (
    <ModalStateContext.Provider
      value={{
        state: state,
        setModalState: (newState) => {
          setState({ ...state, ...newState });
        },
      }}
    >
      {children}
    </ModalStateContext.Provider>
  );
};
export default ModalStateProvider;
