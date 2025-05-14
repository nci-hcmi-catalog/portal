import React from 'react';
import { xor, isEqual } from 'lodash';
import { withTableContext } from '@overture-stack/arranger-components';

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

  componentDidUpdate() {
    if (!isEqual(this.props.selectedRows, this.state.modelIds)) {
      const modelIds = this.props.selectedRows;
      window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
      this.setState({ modelIds });
    }
  }

  render() {
    return (
      <SelectedModelsContext.Provider
        value={{
          state: this.state,
          storageKey: this.storageKey,
          setModels: (modelIds) => {
            window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
            this.setState({ modelIds });
          },
          toggleModel: (modelId) => {
            const modelIds = xor(this.state.modelIds, [modelId]);
            window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
            return this.setState({ ...this.state, modelIds });
          },
          clearModels: () => {
            window.sessionStorage.setItem(this.storageKey, JSON.stringify([]));
            return this.setState({ ...this.state, modelIds: [] });
          },
        }}
        {...this.props}
      />
    );
  }
}
export default withTableContext(SelectedModelsProvider);
