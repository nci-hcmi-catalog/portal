import React from 'react';

import SingleModelProvider, { SingleModelContext } from './ModelSingleController';

import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';

import { AdminContainer, AdminHeader } from 'theme/adminStyles';
import { AdminModelContent } from 'theme/adminModelStyles';
import { Row } from 'theme/system';

const renderTab = tab => {
  switch (tab) {
    case 'edit':
      return <ModelForm />;
    case 'images':
      return <ModelImages />;
    case 'variants':
      return <ModelVariants />;
    default:
      return <ModelForm />;
  }
};

export default () => (
  <SingleModelProvider>
    <SingleModelContext.Consumer>
      {({
        match,
        state: {
          ModelSingle: { activeTab },
        },
      }) => (
        <AdminContainer>
          <AdminHeader>
            <div>
              <h1>Header Content</h1>
            </div>
          </AdminHeader>
          <Row>
            <AdminModelNav />
            <AdminModelContent>{renderTab(activeTab)}</AdminModelContent>
          </Row>
        </AdminContainer>
      )}
    </SingleModelContext.Consumer>
  </SingleModelProvider>
);
