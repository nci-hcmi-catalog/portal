import React from 'react';

import ModelSingleProvider, { ModelSingleContext } from './ModelSingleController';
import config from '../config';

import ModelSingleHeader from './ModelSingleHeader';
import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';

import { AdminContainer } from 'theme/adminStyles';
import { AdminModelContent } from 'theme/adminModelStyles';
import { Row } from 'theme/system';

const renderTab = (tab, data) => {
  switch (tab) {
    case 'edit':
      return <ModelForm data={data} />;
    case 'images':
      return <ModelImages />;
    case 'variants':
      return <ModelVariants />;
    default:
      return <ModelForm data={data} />;
  }
};

const Loading = () => <div>Loading ...</div>;

export default ({ match }) => (
  <ModelSingleProvider baseUrl={config.urls.modelBase} modelName={match.params.name}>
    <ModelSingleContext.Consumer>
      {({
        state: {
          ui: { activeTab },
          data: { isLoading, response },
        },
      }) =>
        isLoading ? (
          <Loading />
        ) : (
          <AdminContainer>
            <ModelSingleHeader modelName={match.params.name} />
            <Row>
              <AdminModelNav />
              <AdminModelContent>{renderTab(activeTab, response)}</AdminModelContent>
            </Row>
          </AdminContainer>
        )
      }
    </ModelSingleContext.Consumer>
  </ModelSingleProvider>
);
