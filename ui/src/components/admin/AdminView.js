/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';

import { useGenomicVariantImportNotifications } from 'components/admin/Notifications';

import AdminNav from './AdminNav';
import DataDictionary from './DataDictionary';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { AdminMain, AdminWrapper } from 'theme/adminStyles';

import useInterval from 'utils/useInterval';
import { isEmpty } from 'lodash';

const AdminView = ({ location }) => {
  const didMountRef = useRef(false);
  const {
    importNotifications,
    importRunning,
    fetchImportStatus,
  } = useGenomicVariantImportNotifications();

  // Check for active genomic variant imports on page load
  useEffect(() => {
    if (!didMountRef || !didMountRef.current) {
      fetchImportStatus();
      didMountRef.current = true;
    }
  }, []);

  // Poll for status changes on any active imports
  useInterval(
    async () => await fetchImportStatus(),
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

export default AdminView;
