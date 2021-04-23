import React, { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';

import { checkImportStatus } from 'components/admin/Model/actions/GenomicVariants';
import { useGenomicVariantImportNotifications } from 'components/admin/Notifications';

import AdminNav from './AdminNav';
import DataDictionary from './DataDictionary';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { AdminMain, AdminWrapper } from 'theme/adminStyles';

import useInterval from 'utils/useInterval';
import { isEmpty } from 'lodash';

export default ({ location }) => {
  const didMountRef = useRef(false);
  const {
    importNotifications,
    importRunning,
    updateNotificationsFromStatus,
    showImportStatusCheckError,
  } = useGenomicVariantImportNotifications();

  // Check for active genomic variant imports on page load
  useEffect(() => {
    const getActiveImports = async () => {
      await checkImportStatus()
        .then(importStatus => {
          updateNotificationsFromStatus(importStatus);
        }).catch(error => {
          showImportStatusCheckError(error);
        });
    };

    if (!didMountRef || !didMountRef.current) {
      getActiveImports();
      didMountRef.current = true;
    }
  }, []);

  // Poll for status changes on any active imports
  useInterval(
    () => {
      checkImportStatus()
        .then(importStatus => {
          updateNotificationsFromStatus(importStatus);
        }).catch(error => {
          showImportStatusCheckError(error);
        });
    },
    importRunning || !isEmpty(importNotifications) ? 500 : null,
  );

  return (
    <AdminWrapper>
      <AdminNav location={location} />
      <AdminMain id="main">
        <Route exact path="/admin" component={ModelsManager} />
        <Route exact path="/admin/model/:name?" component={ModelSingle} />
        <Route exact path="/admin/manage-users" component={UsersManager} />
        <Route exact path="/admin/data-dictionary" component={DataDictionary} />
      </AdminMain>
    </AdminWrapper>
  );
};
