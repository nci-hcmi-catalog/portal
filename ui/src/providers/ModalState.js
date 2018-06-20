import React from 'react';

export const ModalStateContext = React.createContext();

class ModalStateProvider extends React.Component {
  state = {
    component: null,
  };

  render() {
    return (
      <ModalStateContext.Provider
        value={{
          state: this.state,
          setModalState: newState => {
            this.setState({ ...this.state, ...newState });
          },
        }}
        {...this.props}
      />
    );
  }
}
export default ModalStateProvider;
