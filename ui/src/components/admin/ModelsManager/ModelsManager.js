import React from 'react';
import styled from 'react-emotion';

import { ModalStateContext } from 'providers/ModalState';
import ModelManagerTable from './ModelManagerTable';
import { modelEditUrlBase } from '../AdminNav';
import BulkUploader from '../BulkUpload';

import ModelIcon from '../../../icons/ModelIcon';

import { AdminContainer, AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill, LinkPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { BulkUploadModalStyle } from '../../../theme/adminBulkUploadStyles';

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
        <AdminHeaderBlock>
          <ModalStateContext.Consumer>
            {modalState => (
              <Pill
                primary
                marginRight="10px"
                onClick={() =>
                  modalState.setModalState({
                    component: <BulkUploader type={'model'} />,
                    shouldCloseOnOverlayClick: true,
                    styles: BulkUploadModalStyle,
                  })
                }
              >
                Add Bulk
              </Pill>
            )}
          </ModalStateContext.Consumer>
          <LinkPill primary to={modelEditUrlBase}>
            Add A Model
          </LinkPill>
        </AdminHeaderBlock>
      </AdminHeader>
      <Table>
        <ModelManagerTable />
      </Table>
    </AdminContainer>
  );
};

export default content;
