import React, { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';

import {
  acknowledgeImportStatus,
  checkImportStatus,
} from 'components/admin/Model/actions/GenomicVariants';
import { useGenomicVariantImportNotifications } from 'components/admin/Notifications';

import AdminNav from './AdminNav';
import DataDictionary from './DataDictionary';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { AdminMain, AdminWrapper } from 'theme/adminStyles';

import { VARIANT_IMPORT_STATUS } from 'utils/constants';
import useInterval from 'utils/useInterval';

export default ({ location }) => {
  const didMountRef = useRef(false);
  const {
    importNotifications,
    addImportNotification,
    removeImportNotification,
    showSuccessfulImportNotification,
  } = useGenomicVariantImportNotifications();

  // Check for active genomic variant imports on page load
  useEffect(() => {
    const getActiveImports = async () => {
      const activeImports = await checkImportStatus();

      if (activeImports && activeImports.length > 0) {
        activeImports.forEach(activeImport => {
          addImportNotification(activeImport.name);
        });
      }
    };

    if (!didMountRef || !didMountRef.current) {
      getActiveImports();
      didMountRef.current = true;
    }
  }, []);

  // Poll for status changes on any active imports
  useInterval(
    () => {
      checkImportStatus().then(activeImports => {
        if (activeImports.length > 0) {
          activeImports.forEach(activeImport => {
            if (activeImport.status === VARIANT_IMPORT_STATUS.complete) {
              acknowledgeImportStatus(activeImport.name).then(_ => {
                removeImportNotification(activeImport.name);
                showSuccessfulImportNotification(activeImport.name);
              });
            }
          });
        }
      });
    },
    importNotifications && importNotifications.length > 0 ? 1000 : null,
  );

  return (
    <AdminWrapper>
      <AdminNav location={location} />
      <AdminMain>
        <Route exact path="/admin" component={ModelsManager} />
        <Route exact path="/admin/model/:name?" component={ModelSingle} />
        <Route exact path="/admin/manage-users" component={UsersManager} />
        <Route exact path="/admin/data-dictionary" component={DataDictionary} />
      </AdminMain>
    </AdminWrapper>
  );
};
