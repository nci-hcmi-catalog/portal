import React from 'react';
import { AdminTableContext } from './AdminTableController';
import Toolbar from './data-driven/Toolbar';

export default ({ type }) => (
  <AdminTableContext.Consumer>
    {({ state, onFilterValueChange }) => {
      return <Toolbar {...{ state, type, onFilterValueChange }} />;
    }}
  </AdminTableContext.Consumer>
);
