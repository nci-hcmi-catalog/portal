import React from 'react';

import { NotificationToaster } from '../Notifications';
import UserIcon from '../../../icons/PatientIcon';
import AdminPlusIcon from '../../../icons/AdminPlusIcon';
import { AdminContainer, AdminHeader, AdminHeaderH1, AdminHeaderBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import config from '../config';
import ModelManagerProvider, { ModelManagerContext } from '../ModelsManager/ModelManagerController';
import UserManagerTable from './UserManagerTable';

const content = () => {
  return (
    <ModelManagerProvider cmsBase={config.urls.cmsBase} baseUrl={`${config.urls.cmsBase}/User`}>
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
            <Pill primary marginRight="10px" onClick={() => {}}>
              <AdminPlusIcon width={16} height={16} css={'margin-right: 9px;'} />Add A User
            </Pill>
          </AdminHeaderBlock>
        </AdminHeader>
        <Table>
          <UserManagerTable />
        </Table>
      </AdminContainer>
    </ModelManagerProvider>
  );
};

export default content;
