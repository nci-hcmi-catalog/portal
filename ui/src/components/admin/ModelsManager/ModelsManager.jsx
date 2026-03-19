import DNAIcon from '~/icons/DNAIcon';
import PlusIcon from '~/icons/PlusIcon';
import { ModalStateContext } from '~/providers/ModalState';
import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from '~/theme/adminStyles';
import { ButtonPill, LinkPill } from '~/theme/adminControlsStyles';
import { Table } from '~/theme/adminTableStyles';
import { AdminModalStyle } from '~/theme/adminModalStyles';
import { BULK_UPLOAD_TYPES } from '~/utils/constants';

import { NotificationToaster, usePublishNotifications } from '../Notifications';
import { modelEditUrlBase } from '../AdminNav';
import BulkUploader from '../BulkUpload';
import VariantAuditModal from '../VariantAudit';
import config from '../config';
import ModelManagerProvider, { ModelManagerContext } from './ModelManagerController';
import ModelManagerTable from './ModelManagerTable';

const ModelsManager = () => {
  const { publishRunning } = usePublishNotifications();

  return (
    <ModelManagerProvider cmsBase={config.urls.cmsBase} baseUrl={`${config.urls.cmsBase}/Model`}>
      <AdminContainer>
        <NotificationToaster />
        <AdminHeader>
          <AdminHeaderH1>Model Management</AdminHeaderH1>
          <AdminHeaderBlock>
            <ModelManagerContext.Consumer>
              {(context) => {
                const { bulkImportVariants, state } = context ?? {};
                return (
                  <ModalStateContext.Consumer>
                    {(modalState) => (
                      <ButtonPill
                        primary
                        marginRight="8px"
                        onClick={() =>
                          modalState.setModalState({
                            component: (
                              <VariantAuditModal bulkImportVariants={bulkImportVariants} />
                            ),
                            shouldCloseOnOverlayClick: true,
                            styles: AdminModalStyle,
                          })
                        }
                        disabled={(state && state.isLoading) || publishRunning}
                      >
                        <DNAIcon />
                        Check for GDC Variants
                      </ButtonPill>
                    )}
                  </ModalStateContext.Consumer>
                );
              }}
            </ModelManagerContext.Consumer>
            <ModelManagerContext.Consumer>
              {({ uploadModelsFromSheet, state }) => (
                <ModalStateContext.Consumer>
                  {(modalState) => (
                    <ButtonPill
                      primary
                      marginRight="8px"
                      onClick={() =>
                        modalState.setModalState({
                          component: (
                            <BulkUploader
                              type={BULK_UPLOAD_TYPES.MODEL}
                              onUpload={uploadModelsFromSheet}
                              backupURL={`${config.urls.cmsBase}/bulk/backup`}
                            />
                          ),
                          shouldCloseOnOverlayClick: true,
                          styles: AdminModalStyle,
                        })
                      }
                      disabled={(state && state.isLoading) || publishRunning}
                    >
                      <PlusIcon />
                      Add Bulk
                    </ButtonPill>
                  )}
                </ModalStateContext.Consumer>
              )}
            </ModelManagerContext.Consumer>
            <LinkPill primary={`true`} to={modelEditUrlBase}>
              <PlusIcon />
              Add A Model
            </LinkPill>
          </AdminHeaderBlock>
        </AdminHeader>
        <Table>
          <ModelManagerTable />
        </Table>
      </AdminContainer>
    </ModelManagerProvider>
  );
};

export default ModelsManager;
