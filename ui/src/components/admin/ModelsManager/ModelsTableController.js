import React from 'react';
import Component from 'react-component-component';
import PropTypes from 'prop-types';

export const TableController = ({ children }) => (
  <Component
    initialState={{
      minRows: 0,
      page: 0,
      pageSize: 5,
      scrollbarSize: {
        scrollbarWidth: 10,
      },
      defaultPageSize: 5,
      filterValue: '',
      selection: [],
      selectAll: false,
    }}
  >
    {({ state, setState }) =>
      children({
        setState,
        state,
        onPageChange: newPage => setState({ page: newPage }),
      })
    }
  </Component>
);

TableController.propTypes = {
  children: PropTypes.func.isRequired,
};
