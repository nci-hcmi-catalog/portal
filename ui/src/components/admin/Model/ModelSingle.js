import React from 'react';

import ModelSingleProvider, { ModelSingleContext } from './ModelSingleController';
import config from '../config';

import ModelSingleHeader from './ModelSingleHeader';
import ModelSingleFooter from './ModelSingleFooter';
import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';

import { AdminContainer } from 'theme/adminStyles';
import { AdminModelContent, Loading } from 'theme/adminModelStyles';
import { Row } from 'theme/system';

const renderTab = (tab, data) => {
  switch (tab) {
    case 'edit':
      return <ModelForm key={data._id} data={data} />;
    case 'images':
      return <ModelImages />;
    case 'variants':
      return <ModelVariants />;
    default:
      return <ModelForm key={data._id} data={data} />;
  }
};

export default ({ match }) => (
  <ModelSingleProvider baseUrl={config.urls.modelBase} modelName={match.params.name}>
    <ModelSingleContext.Consumer>
      {({
        state: {
          ui: { activeTab },
          data: { isLoading, response },
        },
      }) => (
        <AdminContainer>
          {isLoading && <Loading />}
          <ModelSingleHeader modelName={match.params.name} />
          <Row>
            <AdminModelNav />
            <AdminModelContent>{renderTab(activeTab, response)}</AdminModelContent>
          </Row>
          <ModelSingleFooter />
        </AdminContainer>
      )}
    </ModelSingleContext.Consumer>
  </ModelSingleProvider>
);
