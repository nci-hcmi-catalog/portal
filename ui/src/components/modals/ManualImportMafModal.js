import React, { useState } from 'react';

import { ModalStateContext } from 'providers/ModalState';
import { NotificationsContext } from 'components/admin/Notifications/NotificationsController';
import NOTIFICATION_TYPES from 'components/admin/Notifications/NotificationTypes';
import {
  manualMafImport,
  acknowledgeImportStatus,
} from 'components/admin/Model/actions/GenomicVariants';

import {
  AdminModalStyle,
  ModalWrapper,
  Header,
  Title,
  CloseModal,
  Content,
  Footer,
} from 'theme/adminModalStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Input } from 'theme/formComponentsStyles';

const doThenClose = (next, modalState) => async () => {
  await next();
  return modalState.setModalState({ component: null });
};

const ManualImportMaf = ({
  title = 'Manual Import from GDC',
  confirmLabel = 'Import',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel = () => false,
  modelName,
  notifications,
  appendNotification,
  importProgress,
  setImportProgress,
}) => {
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState('');
  const [filename, setFilename] = useState('');

  const confirmMafFile = async () => {
    setLoading(true);
    await manualMafImport(modelName, fileId, filename)
      .then(async _ => {
        const existingNotification = notifications.find(x => x.modelName === modelName);

        if (existingNotification) {
          existingNotification.clear();
        }

        if (onConfirm) {
          await onConfirm();
        }
      })
      .catch(error => {
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Import Error with No Action Required: An unexpected error occured while trying to import a MAF file for ${modelName}`,
          details: error.message,
          timeout: false,
          modelName,
          onClose: () => acknowledgeImportStatus(modelName),
        });
      });
  };

  return (
    <ModalStateContext.Consumer>
      {modalState => (
        <ModalWrapper>
          <Header>
            <Title>{title}</Title>
            <CloseModal onClick={() => modalState.setModalState({ component: null })} />
          </Header>
          <Content>
            <span style={{ marginBottom: '24px' }}>
              Please specify the MAF file you would like to import for this model:
            </span>
            <h3>File Name:</h3>
            <Input
              type="text"
              placeholder="File Name"
              aria-label={`File Name`}
              value={filename}
              onChange={({ target: { value } }) => setFilename(value)}
            />
            <h3>File UUID:</h3>
            <Input
              type="text"
              placeholder="File UUID"
              aria-label={`File UUID`}
              value={fileId}
              onChange={({ target: { value } }) => setFileId(value)}
            />
          </Content>
          <Footer>
            <ButtonPill
              primary
              marginRight={'10px'}
              disabled={!fileId.length || !filename.length || loading}
              onClick={doThenClose(confirmMafFile, modalState)}
            >
              {confirmLabel}
            </ButtonPill>
            <ButtonPill secondary onClick={doThenClose(onCancel, modalState)}>
              {cancelLabel}
            </ButtonPill>
          </Footer>
        </ModalWrapper>
      )}
    </ModalStateContext.Consumer>
  );
};

const ManualImportMafModal = ({
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  modelName,
}) => Component => (
  <NotificationsContext.Consumer>
    {({ notifications, appendNotification, importProgress, setImportProgress }) => (
      <ModalStateContext.Consumer>
        {modalState =>
          React.cloneElement(Component, {
            onClick: () => {
              modalState.setModalState({
                component: (
                  <ManualImportMaf
                    {...{
                      title,
                      confirmLabel,
                      cancelLabel,
                      onConfirm,
                      onCancel,
                      modelName,
                      notifications,
                      appendNotification,
                      importProgress,
                      setImportProgress,
                    }}
                  />
                ),
                shouldCloseOnOverlayClick: true,
                styles: AdminModalStyle,
              });
            },
          })
        }
      </ModalStateContext.Consumer>
    )}
  </NotificationsContext.Consumer>
);

export default ManualImportMafModal;
