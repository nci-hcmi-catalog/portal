import React from 'react';

import ModelManagerProvider, { ModelManagerContext } from './ModelManagerController';
import { ModalStateContext } from 'providers/ModalState';

import { NotificationToaster } from '../Notifications';
import ModelManagerTable from './ModelManagerTable';
import { modelEditUrlBase } from '../AdminNav';
import BulkUploader from '../BulkUpload';

import ModelIcon from '../../../icons/ModelIcon';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill, LinkPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

import config from '../config';

const content = () => {
  return (
    <ModelManagerProvider baseUrl={`${config.urls.cmsBase}/Model`}>
      <AdminContainer>
        <NotificationToaster />
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
            <ModelManagerContext.Consumer>
              {({ uploadModelsFromSheet }) => (
                <ModalStateContext.Consumer>
                  {modalState => (
                    <Pill
                      primary
                      marginRight="10px"
                      onClick={() =>
                        modalState.setModalState({
                          component: (
                            <BulkUploader type={'model'} onUpload={uploadModelsFromSheet} />
                          ),
                          shouldCloseOnOverlayClick: true,
                          styles: AdminModalStyle,
                        })
                      }
                    >
                      <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add Bulk
                    </Pill>
                  )}
                </ModalStateContext.Consumer>
              )}
            </ModelManagerContext.Consumer>
            <LinkPill primary to={modelEditUrlBase}>
              <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add A Model
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
