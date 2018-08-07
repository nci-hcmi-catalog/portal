import React from 'react';

export const SingleModelContext = React.createContext();

class SingleModelProvider extends React.Component {
  state = {
    ModelSingle: {
      activeTab: 'edit',
    },
  };
  render() {
    return (
      <SingleModelContext.Provider
        value={{
          state: this.state,
          setModelSingleActiveTab: tabName => {
            this.setState({
              ...this.state,
              ModelSingle: {
                ...this.state.ModelSingle,
                activeTab: tabName,
              },
            });
          },
        }}
        {...this.props}
      />
    );
  }
}

export default SingleModelProvider;
