import React from 'react';

import ModelSingleProvider, { ModelSingleContext } from './ModelSingleController';
import config from '../config';

import ModelSingleHeader from './ModelSingleHeader';
import ModelSingleFooter from './ModelSingleFooter';
import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';
import { NotificationToaster } from '../Notifications';

import { AdminContainer } from 'theme/adminStyles';
import { AdminModelContent, Loading } from 'theme/adminModelStyles';
import { Row } from 'theme/system';

const renderTab = (tab, data, otherModelOptions) => {
  const dataKey = JSON.stringify(data);
  switch (tab) {
    case 'images':
      return <ModelImages data={data} />;
    case 'variants':
      return <ModelVariants key={dataKey} data={data} />;
    case 'edit':
    default:
      return <ModelForm key={dataKey} data={data} otherModelOptions={otherModelOptions} />;
  }
};

export default ({ match }) => (
  <ModelSingleProvider baseUrl={config.urls.cmsBase} modelName={match.params.name}>
    <ModelSingleContext.Consumer>
      {({
        state: {
          ui: { activeTab },
          data: { isLoading, response },
          otherModelOptions,
        },
      }) => (
        <AdminContainer>
          {isLoading && <Loading />}
          <NotificationToaster />
          <ModelSingleHeader modelName={response.name} />
          <Row>
            <AdminModelNav />
            <AdminModelContent>
              {renderTab(activeTab, response, otherModelOptions)}
            </AdminModelContent>
          </Row>
          <ModelSingleFooter />
        </AdminContainer>
      )}
    </ModelSingleContext.Consumer>
  </ModelSingleProvider>
);
