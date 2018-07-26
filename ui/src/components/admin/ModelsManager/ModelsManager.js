import React from 'react';
import styled from 'react-emotion';
import { Row } from 'theme/system';
import ModelIcon from '../../../icons/ModelIcon';
import base from 'theme';
import ReactTable from 'react-table';

const Container = styled('div')`
  background-color: #f3f6f7;
  width: 100%;
  label: models-manager-main;
`;

const ContentPanel = styled('div')`
  padding: 10px 100px 10px 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  label: models-manager-content;
`;

const {
  palette,
  buttons: { pillBase },
} = base;

const MenuBar = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  label: models-manager-menu-bar;
`;

const Title = styled('div')`
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: center;
  label: models-manager-title;
`;
const ControlPill = styled('div')`
  ${pillBase};
  background-color: ${palette[11]};
  color: #ffffff;
  margin-left: auto;
  margin-left: ${props => props.last && '20px'};
  justify-content: space-between;
  label: models-manager-controls;
`;

const Table = styled('div')`
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 6px solid white;
  border-bottom: 6px solid white;
  label: models-manager-table;
`;

const TableHeaderToolbar = styled('div')`
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: center;
  label: models-manager-table-header-bar;
`;

const TableFooterToolbar = styled('div')`
  display: flex;
  flex-direction: row;
  min-height: 50px;
  align-items: center;
  padding: 20px;
  label: models-manager-table-footer-bar;
`;

const content = () => {
  return (
    <Container>
      <ContentPanel>
        <MenuBar>
          <Title>
            <ModelIcon height={30} width={30} />Model Management
          </Title>
          <ControlPill>Add Bulk</ControlPill>
          <ControlPill last>Add A Model</ControlPill>
        </MenuBar>
        <Table>
          <TableHeaderToolbar />
          <TableFooterToolbar />
        </Table>
      </ContentPanel>
    </Container>
  );
};

export default content;
