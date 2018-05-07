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
          setModal: ({ component }) => {
            this.setState({ component });
          },
        }}
        {...this.props}
      />
    );
  }
}
export default ModalStateProvider;
