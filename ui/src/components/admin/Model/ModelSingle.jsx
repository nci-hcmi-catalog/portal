import React from 'react';

import { AdminContainer } from '~/theme/adminStyles';
import { AdminModelContent, Loading } from '~/theme/adminModelStyles';
import { Row } from '~/theme/system';

import config from '../config';
import { NotificationToaster } from '../Notifications';

import ModelSingleProvider, { ModelSingleContext } from './ModelSingleController';
import ModelSingleHeader from './ModelSingleHeader';
import ModelSingleFooter from './ModelSingleFooter';
import AdminModelNav from './AdminModelNav';
import ModelForm from './ModelForm';
import ModelImages from './ModelImages';
import ModelVariants from './ModelVariants';

const renderTab = (tab, data, otherModelOptions, dictionary, validator) => {
  const dataKey = JSON.stringify(data);
  switch (tab) {
    case 'images':
      return <ModelImages data={data} />;
    case 'variants':
      return <ModelVariants key={dataKey} data={data} />;
    case 'edit':
    default:
      return (
        // if validator is loaded that implies otherModelOptions and dictionary also loaded
        // cannot render ModelForm until all these dependencies have been fetched.
        validator && (
          <ModelForm
            key={dataKey}
            data={data}
            otherModelOptions={otherModelOptions}
            dictionary={dictionary}
            validator={validator}
          />
        )
      );
  }
};

const ModelSingle = ({ match }) => {
  return (
    <ModelSingleProvider baseUrl={config.urls.cmsBase} modelName={match?.params.name}>
      <ModelSingleContext.Consumer>
        {({
          state: {
            ui: { activeTab },
            data: { isLoading, response },
            otherModelOptions,
            dictionary,
            validator,
          },
        }) => (
          <AdminContainer>
            {isLoading && <Loading />}
            <NotificationToaster />
            <ModelSingleHeader modelName={response.name} />
            <Row>
              <AdminModelNav />
              <AdminModelContent>
                {renderTab(activeTab, response, otherModelOptions, dictionary, validator)}
              </AdminModelContent>
            </Row>
            <ModelSingleFooter />
          </AdminContainer>
        )}
      </ModelSingleContext.Consumer>
    </ModelSingleProvider>
  );
};

export default ModelSingle;
