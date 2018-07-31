import React from 'react';
import { ReactTableStyle } from 'theme/adminTableStyles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { get, intersection, isEmpty, xor, noop } from 'lodash';
import jsonpath from 'jsonpath/jsonpath.min';
import Component from 'react-component-component';

export default props => {
  const { scrollbarSize, onPaginationChange, propsData, config } = props;
  const { columns, keyField, defaultSorted } = config;

  return (
    <ReactTable
      minRows={0}
      className={`-striped -highlight ${ReactTableStyle({ scrollbarSize })}`}
      onPageChange={page => onPaginationChange({ page })}
      onPageSizeChange={(pageSize, page) => onPaginationChange({ pageSize, page })}
      data={propsData?.data}
      defaultSorted={defaultSorted}
      columns={columns.map(
        ({ Cell, ...c }) => ({
          ...c,
          ...(!c.hasCustomType && !isEmpty(c.extendedDisplayValues)
            ? {
                accessor: x => {
                  const values = c.accessor ? [get(x, c.accessor)] : jsonpath.query(x, c.jsonPath);
                  return values.map(x => c.extendedDisplayValues[`${x}`] || x).join(', ');
                },
                id: c.field,
              }
            : {
                Cell,
              }),
        }),
        {},
      )}
      defaultPageSize={defaultPageSize}
      PaginationComponent={props => (
        <CustomPagination {...props} maxPagesOptions={maxPagesOptions} />
      )}
      {...checkboxProps}
      {...fetchFromServerProps}
    />
  );
};
