import React from 'react';
import Component from 'react-component-component';
import { NotificationToaster } from '../Notifications';
import UserIcon from '../../../icons/PatientIcon';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';
import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { HoverPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { ModalStateContext } from 'providers/ModalState';
import UserManagerTable from './UserManagerTable';
import UserForm from './UserForm';
import { AdminModalStyle } from 'theme/adminModalStyles';
import { NotificationsContext } from '../Notifications';
import config from '../config';
import { fetchData } from '../services/Fetcher';

export const saveUser = async (values, isUpdate, setState, appendNotification) => {
  const { id } = values;

  const url = isUpdate ? `${config.urls.cmsBase}/user/${id}` : `${config.urls.cmsBase}/user`;

  try {
    await fetchData({
      url,
      data: values,
      method: isUpdate ? 'patch' : 'post',
    });
    await appendNotification({
      type: 'success',
      message: 'Save Successful!',
      details: 'User has been successfully saved.',
    });
    setState({ isTableDataSynced: false, isCreate: !isUpdate });
  } catch (err) {
    appendNotification({
      type: 'error',
      message: 'User save error.',
      details: err.details || 'Unknown error has occurred.',
    });
  }
};

export const deleteUser = async (userId, setState, appendNotification) => {
  try {
    await fetchData({
      url: `${config.urls.cmsBase}/user/${userId}`,
      data: '',
      method: 'delete',
    });
    await appendNotification({
      type: 'success',
      message: 'Delete Successful!',
      details: 'User has been successfully deleted.',
    });
    setState({ isTableDataSynced: false });
  } catch (err) {
    appendNotification({
      type: 'error',
      message: 'User delete error.',
      details: err.details || 'Unknown error has occurred.',
    });
  }
};

const content = () => {
  return (
    <Component initialState={{ isTableDataSynced: false, isCreate: false }}>
      {({ state: { isTableDataSynced, isCreate }, setState }) => (
        <NotificationsContext>
          {({ appendNotification }) => {
            const saveFormUser = ({ values, isUpdate }) =>
              saveUser(values, isUpdate, setState, appendNotification);
            const deleteFormUser = ({ id }) => deleteUser(id, setState, appendNotification);
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
                        <HoverPill
                          primary
                          marginRight="10px"
                          onClick={() =>
                            modalState.setModalState({
                              component: <UserForm type={'add'} saveUser={saveFormUser} />,
                              shouldCloseOnOverlayClick: true,
                              styles: AdminModalStyle,
                            })
                          }
                        >
                          <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add A
                          User
                        </HoverPill>
                      )}
                    </ModalStateContext.Consumer>
                  </AdminHeaderBlock>
                </AdminHeader>
                <Table>
                  <UserManagerTable
                    isTableDataSynced={isTableDataSynced}
                    isCreate={isCreate}
                    dataSyncCallback={() => setState({ isTableDataSynced: true, isCreate: false })}
                    baseUrl={config.urls.cmsBase}
                    deleteUser={deleteFormUser}
                    saveUser={saveFormUser}
                  />
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
