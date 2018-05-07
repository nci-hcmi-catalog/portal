import React from 'react';
import { xor } from 'lodash';

export const SelectedModelsContext = React.createContext();

class SelectedModelsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: [],
    };
  }

  render() {
    return (
      <SelectedModelsContext.Provider
        value={{
          state: this.state,
          setModels: ({ models }) => this.setState({ models }),
          toggleModel: modelId => this.setState({ models: xor(this.state.models, [modelId]) }),
        }}
      >
        {this.props.children}
      </SelectedModelsContext.Provider>
    );
  }
}
export default SelectedModelsProvider;
