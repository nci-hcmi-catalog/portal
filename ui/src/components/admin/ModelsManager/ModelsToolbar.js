import React from 'react';
import { Row } from 'theme/system';
import TextInput from '@arranger/components/dist/Input';
import FilterIcon from 'icons/FilterIcon';
import { ModelsTableContext } from './ModelsTableController';

export default props => (
  <ModelsTableContext.Consumer>
    {({ state: { isLoading, page, pageSize, filterValue, rowCount }, onFilterValueChange }) => {
      const [from, to] = [page * pageSize + 1, page * pageSize + pageSize];
      return (
        <>
          {' '}
          <Row className="toolbar" justifyContent="space-between">
            {' '}
            <div>
              {' '}
              {!isLoading &&
                `Showing ${from} - ${to <= rowCount ? to : rowCount} of ${rowCount} Models`}{' '}
            </div>{' '}
            <TextInput
              icon={<FilterIcon height={10} width={10} fill={'#704A2C'} />}
              type="text"
              placeholder="Filter"
              value={filterValue}
              onChange={({ target: { value } }) => onFilterValueChange(value)}
            />{' '}
          </Row>{' '}
        </>
      );
    }}
  </ModelsTableContext.Consumer>
);
