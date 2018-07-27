import React from 'react';

export const AdminContext = React.createContext();

class AdminProvider extends React.Component {
  state = {
    modelUploadSingle: {
      activeTab: 'edit',
    },
  };
  render() {
    return (
      <AdminContext.Provider
        value={{
          state: this.state,
          setModelUploadSingleActiveTab: tabName => {
            this.setState({
              ...this.state,
              modelUploadSingle: {
                ...this.state.modelUploadSingle,
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
