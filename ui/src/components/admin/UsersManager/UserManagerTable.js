import React from 'react';
import Component from 'react-component-component';
import { Toolbar, DataTable } from '../AdminTable';
import { getUserTableColumns } from './UserTableColumns';
import { generateTableActions } from '../helpers';
import { Col } from 'theme/system';
import { getPageData, getCountData } from '../helpers/fetchTableData';
import { debounce } from 'lodash';
const type = 'Users';

const loadData = async (baseUrl, state) => {
  let tableCols = getUserTableColumns({});
  const getData = getPageData({
    baseUrl,
    ...state,
    tableColumns: tableCols,
  });
  const getCount = getCountData({
    baseUrl: `${baseUrl}/count`,
    ...state,
    tableColumns: tableCols,
  });

  return [await getData, await getCount];
};

export const initPagingState = {
  page: 0,
  filterValue: '',
  sorted: {
    id: 'updatedAt',
    desc: true,
  },
  selection: [],
  selectAll: false,
};

const fetchFormData = async ({ state, setState, baseUrl }) => {
  try {
    const [dataResponse, countResponse] = await loadData(`${baseUrl}/User`, state);
    setState(() => ({
      isLoading: false,
      data: dataResponse.data,
      error: null,
      rowCount: countResponse.data.count,
      selection: [],
      selectAll: false,
    }));
  } catch (err) {
    setState(() => ({ isLoading: false, data: [], error: err }));
  }
};

/*
Component state transitions for each action:
1. Add a user: resets table's filter, sort and page #
2. Edit/Delete a user: doesn't reset table's filter, sort and page #
*/
export default ({
  isTableDataSynced,
  isCreate,
  dataSyncCallback,
  baseUrl,
  deleteUser,
  saveUser,
}) => (
  <Component
    initialState={{
      minRows: 0,
      pageSize: 20,
      scrollbarSize: {
        scrollbarWidth: 10,
      },
      selection: [],
      selectAll: false,
      data: [],
      isLoading: false,
      error: null,
      rowCount: 0,
      ...initPagingState,
    }}
    didMount={async ({ state, setState }) => {
      await fetchFormData({ state, setState, baseUrl });
    }}
    // only debounce data load on updates -- this is primarily to prevent too many data fetches as user is filtering the table
    didUpdate={debounce(
      async ({ state, setState, prevState }) => {
        if (
          state.pageSize !== prevState.pageSize ||
          state.page !== prevState.page ||
          state.filterValue !== prevState.filterValue
        ) {
          await fetchFormData({ state, setState, baseUrl });
        } else if (!isTableDataSynced || isCreate) {
          // this condition gets triggered when a new user is created/edited or deleted
          // do this before actual update calls because update calls will invoke another update on component and
          // this prop will still be true; that will cause it to execute below statements again.
          dataSyncCallback();
          // reset filter values and page if a new user is created
          if (isCreate) {
            setState(() => ({
              ...initPagingState,
            }));
          }
          await fetchFormData({ state, setState, baseUrl });
        }
      },
      300,
      { maxWait: 1000, trailing: true },
    )}
  >
    {({ state, setState }) => {
      const tableActions = generateTableActions(setState, state.data);
      return (
        <Col>
          <Toolbar
            {...{
              state,
              type,
              ...tableActions,
            }}
          />
          <DataTable
            {...{
              state,
              tableColumns: getUserTableColumns({ deleteUser, saveUser }),
              simpleTableWithPagination: true,
              ...tableActions,
            }}
          />
        </Col>
      );
    }}
  </Component>
);
//
