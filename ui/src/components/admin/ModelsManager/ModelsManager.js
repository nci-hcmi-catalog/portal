import React from 'react';
import styled from 'react-emotion';
import ModelIcon from '../../../icons/ModelIcon';
import { AdminContainer, AdminHeader } from 'theme/adminStyles';
import { ControlPill } from 'theme/AdminControlsStlyes';
import { Table, TableHeader, TableFooter } from 'theme/adminTableStyles';
import ModelManagerTable from './ModelManagerTable';

const Title = styled('div')`
  min-height: 50px;
  align-items: center;
  padding: 0 50px;
  display: inherit;
  label: models-manager-title;
`;

const Controls = styled('div')`
  min-height: 50px;
  align-items: center;
  padding: 0 50px;
  display: inherit;
  label: models-manager-controls;
`;

const content = () => {
  return (
    <AdminContainer>
      <AdminHeader>
        <Title>
          <ModelIcon height={30} width={30} />Model Management
        </Title>
        <Controls>
          <ControlPill>Add Bulk</ControlPill>
          <ControlPill last>Add A Model</ControlPill>
        </Controls>
      </AdminHeader>
      <Table>
        <TableHeader />
        <ModelManagerTable />
        <TableFooter />
      </Table>
    </AdminContainer>
  );
};

export default content;
