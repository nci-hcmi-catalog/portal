import React from 'react';
import { ReactTableStyle } from 'theme/adminTableStyles';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Component from 'react-component-component';
import { Fetcher } from '../services/Fetcher';
import { columns } from './ModelColumns';

export default props => (
  <Fetcher url={'http://localhost:8080/api/v1/Model'} data={''} method="get">
    {fetcherProps => {
      const { data } = fetcherProps;
      return <ReactTable columns={columns} data={data} />;
    }}
  </Fetcher>
);
