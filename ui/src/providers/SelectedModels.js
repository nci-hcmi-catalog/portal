import React from 'react';
import { xor } from 'lodash';

export const SelectedModelsContext = React.createContext();

class SelectedModelsProvider extends React.Component {
  state = {
    modelIds: [],
  };
  render() {
    return (
      <SelectedModelsContext.Provider
        value={{
          state: this.state,
          setModels: modelIds => this.setState({ modelIds }),
          toggleModel: modelId =>
            this.setState({ ...this.state, modelIds: xor(this.state.modelIds, [modelId]) }),
          clearModels: () => this.setState({ ...this.state, modelIds: [] }),
        }}
        {...this.props}
      />
    );
  }
}
export default SelectedModelsProvider;
