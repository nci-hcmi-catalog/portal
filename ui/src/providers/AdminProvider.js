import React from 'react';

export const AdminContext = React.createContext();

class AdminProvider extends React.Component {
  state = {
    ModelSingle: {
      activeTab: 'edit',
    },
  };
  render() {
    return (
      <AdminContext.Provider
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

export default AdminProvider;
