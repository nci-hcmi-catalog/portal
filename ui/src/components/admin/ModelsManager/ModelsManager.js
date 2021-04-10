import React from 'react';

import ModelManagerProvider, { ModelManagerContext } from './ModelManagerController';
import { ModalStateContext } from 'providers/ModalState';

import { NotificationToaster } from '../Notifications';
import ModelManagerTable from './ModelManagerTable';
import { modelEditUrlBase } from '../AdminNav';
import BulkUploader from '../BulkUpload';

import PlusIcon from './../../../icons/PlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { ButtonPill, LinkPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

import config from '../config';
import { BULK_UPLOAD_TYPES } from 'utils/constants';

const content = () => {
  return (
    <ModelManagerProvider cmsBase={config.urls.cmsBase} baseUrl={`${config.urls.cmsBase}/Model`}>
      <AdminContainer>
        <NotificationToaster />
        <AdminHeader>
          <AdminHeaderH1>Model Management</AdminHeaderH1>
          <AdminHeaderBlock>
            <ModelManagerContext.Consumer>
              {({ uploadModelsFromSheet }) => (
                <ModalStateContext.Consumer>
                  {modalState => (
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

export default content;
