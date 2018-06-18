import React from 'react';
import { xorWith, isEqual } from 'lodash';

export const SelectedModelsContext = React.createContext();

class SelectedModelsProvider extends React.Component {
  state = {
    models: [],
  };
  render() {
    return (
      <SelectedModelsContext.Provider
        value={{
          state: this.state,
          setModels: ({ models }) => this.setState({ models }),
          toggleModel: model => this.setState({ models: xorWith(this.state.models, [model], isEqual) }),
          clearModels: () => this.setState({ ...this.state, models: [] }),
        }}
        {...this.props}
      />
    );
  }
}
export default SelectedModelsProvider;
