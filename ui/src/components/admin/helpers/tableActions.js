// @ts-check

import { xor, get } from 'lodash';

// If we provide a key update that keys
// state instead of the root object
const nestedStateResolver = (state, update, key) =>
  key
    ? {
        [key]: {
          ...state[key],
          ...update,
        },
      }
    : update;

export const generateTableActions = (setState, data, nestedStateKey = false) => ({
  onPageChange: (newPage) =>
    setState((state) =>
      nestedStateResolver(state, { page: newPage, isLoading: true }, nestedStateKey),
    ),
  onFilterValueChange: (newValue) =>
    setState((state) =>
      nestedStateResolver(
        state,
        {
          filterValue: newValue,
          page: 0,
          selection: [],
          selectAll: false,
        },
        nestedStateKey,
      ),
    ),
  onPageSizeChange: (newValue) =>
    setState((state) =>
      nestedStateResolver(state, { page: 0, pageSize: newValue, isLoading: true }, nestedStateKey),
    ),
  onSortedChange: (sorted) =>
    // since multisort is disabled; there is always one sorted field
    setState((state) => nestedStateResolver(state, { sorted: sorted[0], page: 0 }, nestedStateKey)),
  toggleSelection: (id) =>
    setState((state) =>
      nestedStateResolver(
        state,
        {
          // Becasue we can have a nested key we use the lodash get function to extract the correct value
          selection: xor(get(state, nestedStateKey ? `${nestedStateKey}.selection` : 'selection'), [
            id,
          ]),
        },
        nestedStateKey,
      ),
    ),
  toggleAll: () => {
    const ids = data.map(({ _id }) => _id);

    return setState((state) =>
      nestedStateResolver(
        state,
        {
          selection:
            // Becasue we can have a nested key we use the lodash get function to extract the correct value
            get(state, nestedStateKey ? `${nestedStateKey}.selection` : 'selection').length ===
            ids.length
              ? []
              : ids,
          // Becasue we can have a nested key we use the lodash get function to extract the correct value
          selectAll: !get(state, nestedStateKey ? `${nestedStateKey}.selectAll` : 'selectAll'),
        },
        nestedStateKey,
      ),
    );
  },
});
