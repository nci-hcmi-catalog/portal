import { xor } from 'lodash';

export const generateTableActions = (state, setState, data) => ({
  onPageChange: newPage => setState({ page: newPage, isLoading: true }),
  onFilterValueChange: newValue => setState({ filterValue: newValue }),
  onPageSizeChange: newValue => setState({ page: 0, pageSize: newValue, isLoading: true }),
  toggleSelection: id => setState({ ...state, selection: xor(state.selection, [id]) }),
  toggleAll: () => {
    const ids = data.map(({ _id }) => _id);

    return setState({
      ...state,
      selection: state.selection.length === ids.length ? [] : ids,
      selectAll: !state.selectAll,
    });
  },
});
