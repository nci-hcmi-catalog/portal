import React from 'react';
import { ReactTableStyle } from 'theme/adminTableStyles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Fetcher } from '../services/Fetcher';
import { columns } from './ModelColumns';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
import { TableController } from './ModelsTableController';
import { Col } from 'theme/system';
import ModelsToolbar from './ModelsToolbar';
import searchStyles from 'theme/searchStyles';

export default props => (
  <Fetcher url={'http://localhost:8080/api/v1/Model'} data={''} method="get">
    {({ isLoading, data, ...fetcherProps }) => (
      <TableController>
        {({ setState, state, onPageChange }) => (
          <Col>
            <ModelsToolbar
              rowCount={data.length}
              {...{ setState, ...state, rowCount: data.length }}
            />
            <div css={searchStyles}>
              <ReactTable
                minRows={0}
                loading={state.isLoading}
                columns={columns}
                data={data}
                showPagination={data.length > 10}
                className={`-striped`}
                defaultPageSize={state.defaultPageSize}
                page={state.page}
                PaginationComponent={props => (
                  <CustomPagination
                    {...state}
                    {...{
                      pages: data.length / state.pageSize,
                      showPageSizeOptions: false,
                      showPageJump: true,
                      canPrevious: true,
                      canNext: true,
                      maxPagesOptions: 10,
                      onPageChange: onPageChange,
                    }}
                  />
                )}
                onPageChange={onPageChange}
              />
            </div>
          </Col>
        )}
      </TableController>
    )}
  </Fetcher>
);
