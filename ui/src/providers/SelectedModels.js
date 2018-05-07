import React from 'react';
import { xor } from 'lodash';

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
          toggleModel: modelId => this.setState({ models: xor(this.state.models, [modelId]) }),
        }}
        {...this.props}
      />
    );
  }
}
export default SelectedModelsProvider;
