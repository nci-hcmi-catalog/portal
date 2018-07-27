import React from 'react';
import styled from 'react-emotion';
import { Row, Col } from 'theme/system';
import ModelIcon from '../../../icons/ModelIcon';
import ReactTable from 'react-table';
import { AdminContainer, AdminContent, AdminHeader } from 'theme/adminStyles';
import { ControlPill } from '../AdminControls';

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

const Table = styled(Col)`
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 6px solid white;
  border-bottom: 6px solid white;
  label: models-manager-table;
`;

const TableHeaderToolbar = styled(Row)`
  min-height: 50px;
  align-items: center;
  label: models-manager-table-header;
`;

const TableFooterToolbar = styled(Row)`
  min-height: 50px;
  align-items: center;
  padding: 20px;
  label: models-manager-table-footer-bar;
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
        <TableHeaderToolbar />
        <TableFooterToolbar />
      </Table>
    </AdminContainer>
  );
};

export default content;
