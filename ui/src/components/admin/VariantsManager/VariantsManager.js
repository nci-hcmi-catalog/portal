import React from 'react';
import { ModalStateContext } from 'providers/ModalState';
import VariantManagerTable from './VariantManagerTable';
import BulkUploader from '../BulkUpload';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';
import { AdminContainer, AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

const content = ({ modelId }) => {
  return (
    <AdminContainer>
      <AdminHeader>
        <h3>Variant Data</h3>
        <AdminHeaderBlock>
          <ModalStateContext.Consumer>
            {modalState => (
              <Pill
                primary
                marginRight="10px"
                onClick={() =>
                  modalState.setModalState({
                    component: <BulkUploader type={'variant'} />,
                    shouldCloseOnOverlayClick: true,
                    styles: AdminModalStyle,
                  })
                }
              >
                <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add Variants
              </Pill>
            )}
          </ModalStateContext.Consumer>
        </AdminHeaderBlock>
      </AdminHeader>
      <Table>
        <VariantManagerTable />
      </Table>
    </AdminContainer>
  );
};

export default content;
