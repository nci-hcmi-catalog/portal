import React from 'react';
import Component from 'react-component-component';
import { NotificationToaster } from '../Notifications';
import UserIcon from '../../../icons/PatientIcon';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';
import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { ModalStateContext } from 'providers/ModalState';
import UserManagerTable from './UserManagerTable';
import UserForm from './UserForm';
import { AdminModalStyle } from 'theme/adminModalStyles';
import { NotificationsContext } from '../Notifications';
const content = () => {
  return (
    <Component initialState={{ isDataUpdated: false }}>
      {({ state: { isDataUpdated }, setState }) => (
        <NotificationsContext>
          {({ appendNotification }) => {
            return (
              <AdminContainer>
                <NotificationToaster />
                <AdminHeader>
                  <AdminHeaderH1>
                    <UserIcon
                      height={35}
                      width={35}
                      css={`
                        margin-right: 13px;
                      `}
                    />User Management
                  </AdminHeaderH1>
                  <AdminHeaderBlock>
                    <ModalStateContext.Consumer>
                      {modalState => (
                        <Pill
                          primary
                          marginRight="10px"
                          onClick={() =>
                            modalState.setModalState({
                              component: (
                                <UserForm type={'add'} appendNotification={appendNotification} />
                              ),
                              shouldCloseOnOverlayClick: true,
                              styles: AdminModalStyle,
                            })
                          }
                        >
                          <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add A
                          User
                        </Pill>
                      )}
                    </ModalStateContext.Consumer>
                  </AdminHeaderBlock>
                </AdminHeader>
                <Table>
                  <UserManagerTable {...isDataUpdated} />
                </Table>
              </AdminContainer>
            );
          }}
        </NotificationsContext>
      )}
    </Component>
  );
};

export default content;
