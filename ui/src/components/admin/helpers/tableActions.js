// @ts-check

import { xor, get } from 'lodash';

const nestedStateResolver = (state, update, path) =>
  path
    ? {
        ...state,
        [path]: {
          ...state[path],
          ...update,
        },
      }
    : update;

export const generateTableActions = (setState, data, nestedStatePath = false) => ({
  onPageChange: newPage =>
    setState(state =>
      nestedStateResolver(state, { page: newPage, isLoading: true }, nestedStatePath),
    ),
  onFilterValueChange: newValue =>
    setState(state => nestedStateResolver(state, { filterValue: newValue }, nestedStatePath)),
  onPageSizeChange: newValue =>
    setState(state =>
      nestedStateResolver(state, { page: 0, pageSize: newValue, isLoading: true }, nestedStatePath),
    ),
  toggleSelection: id =>
    setState(state =>
      nestedStateResolver(
        state,
        {
          selection: xor(
            get(state, nestedStatePath ? `${nestedStatePath}.selection` : 'selection'),
            [id],
          ),
        },
        nestedStatePath,
      ),
    ),
  toggleAll: () => {
    const ids = data.map(({ _id }) => _id);

    return setState(state =>
      nestedStateResolver(
        state,
        {
          selection:
            get(state, nestedStatePath ? `${nestedStatePath}.selection` : 'selection').length ===
            ids.length
              ? []
              : ids,
          selectAll: !get(state, nestedStatePath ? `${nestedStatePath}.selectAll` : 'selectAll'),
        },
        nestedStatePath,
      ),
    );
  },
});
