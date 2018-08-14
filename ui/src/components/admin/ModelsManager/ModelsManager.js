import React from 'react';
import styled from 'react-emotion';
import ModelIcon from '../../../icons/ModelIcon';
import { AdminContainer, AdminHeader, AdminContent } from 'theme/adminStyles';
import { ControlPill, Controls } from 'theme/duplicateAdminControlsStlyes';
import { Table } from 'theme/adminTableStyles';
import ModelManagerTable from './ModelManagerTable';
import { ModalStateContext } from 'providers/ModalState';
import BulkUploader from '../BulkUpload';
import modelListModalStyles from 'theme/modelListModalStyles';

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
          <ModalStateContext.Consumer>
            {modalState => (
              <ControlPill
                onClick={() =>
                  modalState.setModalState({
                    component: <BulkUploader type={'model'} />,
                    shouldCloseOnOverlayClick: true,
                  })
                }
              >
                Add Bulk
              </ControlPill>
            )}
          </ModalStateContext.Consumer>
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
