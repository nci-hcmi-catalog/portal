import React from 'react';
import styled from 'react-emotion';
import ModelIcon from '../../../icons/ModelIcon';
import { AdminContainer, AdminHeader, AdminContent } from 'theme/adminStyles';
import { ControlPill, Controls } from 'theme/AdminControlsStlyes';
import { Table } from 'theme/adminTableStyles';
import ModelManagerTable from './ModelManagerTable';

const Title = styled('div')`
  min-height: 50px;
  align-items: center;
  display: inherit;
  label: models-manager-title;
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
        <ModelManagerTable />
      </Table>
    </AdminContainer>
  );
};

export default content;
