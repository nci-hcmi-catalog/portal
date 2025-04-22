import React from 'react';
import Component from 'react-component-component';
import PlusIcon from '../../../icons/PlusIcon';
import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { ModalStateContext } from 'providers/ModalState';
import UserManagerTable from './UserManagerTable';
import UserForm from './UserForm';
import { AdminModalStyle } from 'theme/adminModalStyles';
import { NotificationsContext, NotificationToaster, NOTIFICATION_TYPES } from '../Notifications';
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
      type: NOTIFICATION_TYPES.SUCCESS,
      message: 'Save Successful!',
      details: 'User has been successfully saved.',
    });
    setState({ isTableDataSynced: false, isCreate: !isUpdate });
  } catch (err) {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
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
      type: NOTIFICATION_TYPES.SUCCESS,
      message: 'Delete Successful!',
      details: 'User has been successfully deleted.',
    });
    setState({ isTableDataSynced: false });
  } catch (err) {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'User delete error.',
      details: err.details || 'Unknown error has occurred.',
    });
  }
};

const content = () => {
  return (
    <Component initialState={{ isTableDataSynced: false, isCreate: false }}>
      {({ state: { isTableDataSynced, isCreate }, setState }) => (
        <NotificationsContext.Consumer>
          {({ appendNotification }) => {
            const saveFormUser = ({ values, isUpdate }) =>
              saveUser(values, isUpdate, setState, appendNotification);
            const deleteFormUser = ({ id }) => deleteUser(id, setState, appendNotification);
            return (
              <AdminContainer>
                <NotificationToaster />
                <AdminHeader>
                  <AdminHeaderH1>User Management</AdminHeaderH1>
                  <AdminHeaderBlock>
                    <ModalStateContext.Consumer>
                      {(modalState) => (
                        <ButtonPill
                          primary
                          onClick={() =>
                            modalState.setModalState({
                              component: <UserForm type={'add'} saveUser={saveFormUser} />,
                              shouldCloseOnOverlayClick: true,
                              styles: AdminModalStyle,
                            })
                          }
                        >
                          <PlusIcon />
                          Add A User
                        </ButtonPill>
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
        </NotificationsContext.Consumer>
      )}
    </Component>
  );
};

export default content;
