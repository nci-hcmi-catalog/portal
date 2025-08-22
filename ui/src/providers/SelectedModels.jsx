import React from 'react';
import { xor, isEqual } from 'lodash';
import { withTableContext } from '@overture-stack/arranger-components';

export const SelectedModelsContext = React.createContext();

const selectedRowsReducer = (acc, val) => ({
  [val]: true,
  ...acc,
});
class SelectedModelsProvider extends React.Component {
  storageKey = 'selected_models';
  constructor(props) {
    super(props);

    this.state = { modelIds: [] };
  }

  componentDidMount() {
    const storedSelectedModels = JSON.parse(window.sessionStorage.getItem(`${this.storageKey}`));
    if (storedSelectedModels) {
      const { setSelectedRowsDict } = this.props;
      this.setState({ modelIds: storedSelectedModels });
      const selectedRows = storedSelectedModels.reduce(selectedRowsReducer, {});
      setSelectedRowsDict(selectedRows);
    }
  }

  componentDidUpdate() {
    if (!isEqual(this.props.selectedRows, this.state.modelIds)) {
      const { selectedRows: modelIds } = this.props;
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
            const { setSelectedRowsDict } = this.props;
            window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
            this.setState({ modelIds });
            const selectedRows = modelIds.reduce(selectedRowsReducer, {});
            setSelectedRowsDict(selectedRows);
          },
          toggleModel: (modelId) => {
            const { setSelectedRowsDict } = this.props;
            const modelIds = xor(this.state.modelIds, [modelId]);
            window.sessionStorage.setItem(this.storageKey, JSON.stringify(modelIds));
            this.setState({ ...this.state, modelIds });
            const selectedRows = modelIds.reduce(selectedRowsReducer, {});
            setSelectedRowsDict(selectedRows);
          },
          clearModels: () => {
            const { setSelectedRowsDict } = this.props;
            window.sessionStorage.setItem(this.storageKey, JSON.stringify([]));
            this.setState({ ...this.state, modelIds: [] });
            setSelectedRowsDict({});
          },
        }}
        {...this.props}
      />
    );
  }
}
export default withTableContext(SelectedModelsProvider);
