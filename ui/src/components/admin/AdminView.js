/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useGenomicVariantImportNotifications } from 'components/admin/Notifications';
import { usePublishNotifications } from 'components/admin/Notifications';

import AdminNav from './AdminNav';
import DataDictionary from './DataDictionary';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { AdminMain, AdminWrapper } from 'theme/adminStyles';

import config from './config';
import useInterval from 'utils/useInterval';
import { isEmpty } from 'lodash';

const { googleAppId } = config;

const AdminView = ({ location }) => {
  const didMountRef = useRef(false);
  const [importPollingInterval, setImportPollingInterval] = useState(500);
  const [publishPollingInterval, setPublishPollingInterval] = useState(500);
  const {
    importNotifications,
    importRunning,
    fetchImportStatus,
  } = useGenomicVariantImportNotifications();
  const { publishNotifications, publishRunning, fetchPublishStatus } = usePublishNotifications();

  // Check for active genomic variant imports or publishes on page load
  useEffect(() => {
    if (!didMountRef || !didMountRef.current) {
      fetchImportStatus();
      fetchPublishStatus();
      didMountRef.current = true;
    }
  }, []);

  // Poll for status changes on any active imports
  useInterval(
    async () => {
      // Set polling interval to null until request completes to prevent spamming the server
      setImportPollingInterval(null);
      await fetchImportStatus();
      setImportPollingInterval(500);
    },
    importRunning || !isEmpty(importNotifications) ? importPollingInterval : null,
  );

  // Poll for status changes on any active publishes
  useInterval(
    async () => {
      setPublishPollingInterval(null);
      await fetchPublishStatus();
      setPublishPollingInterval(500);
    },
    publishRunning || !isEmpty(publishNotifications) ? publishPollingInterval : null,
  );

  return (
    <AdminWrapper>
      <GoogleOAuthProvider clientId={googleAppId}>
        <AdminNav location={location} />
        <AdminMain id="main">
          <Route exact path="/admin" component={ModelsManager} />
          <Route exact path="/admin/model/:name?" component={ModelSingle} />
          <Route exact path="/admin/manage-users" component={UsersManager} />
          <Route exact path="/admin/data-dictionary" component={DataDictionary} />
        </AdminMain>
      </GoogleOAuthProvider>
    </AdminWrapper>
  );
};

export default AdminView;
