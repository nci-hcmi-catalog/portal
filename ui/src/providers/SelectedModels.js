import React, { useEffect } from 'react';
import { xor } from 'lodash';

export const SelectedModelsContext = React.createContext();

class SelectedModelsProvider extends React.Component {
  storageKey = 'selected_models';
  constructor(props) {
    super(props);

    this.state = { modelIds: [] };
  }

  componentDidMount() {
    const storedSelectedModels = JSON.parse(window.sessionStorage.getItem(`${this.storageKey}`));
    if (storedSelectedModels) {
      this.setState({ modelIds: storedSelectedModels });
    }
  }

  render() {
    return (
      <SelectedModelsContext.Provider
        value={{
          state: this.state,
          storageKey: this.storageKey,
          setModels: modelIds => {
            console.log('jondev', 'Provider.setModels', { modelIds });
            window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
            this.setState({ modelIds });
          },
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
