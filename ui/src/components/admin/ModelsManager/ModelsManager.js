import React from 'react';

import { ModalStateContext } from 'providers/ModalState';
import ModelManagerTable from './ModelManagerTable';
import { modelEditUrlBase } from '../AdminNav';
import BulkUploader from '../BulkUpload';

import ModelIcon from '../../../icons/ModelIcon';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill, LinkPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

const content = () => {
  return (
    <AdminContainer>
      <AdminHeader>
        <AdminHeaderH1>
          <ModelIcon
            height={35}
            width={35}
            css={`
              margin-right: 13px;
            `}
          />Model Management
        </AdminHeaderH1>
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
                    styles: AdminModalStyle,
                  })
                }
              >
                <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add Bulk
              </Pill>
            )}
          </ModalStateContext.Consumer>
          <LinkPill primary to={modelEditUrlBase}>
            <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add A Model
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
