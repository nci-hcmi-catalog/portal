import React, { useState } from 'react';
import ReactTable from 'react-table';

import { ModalStateContext } from 'providers/ModalState';
import { NotificationsContext } from 'components/admin/Notifications/NotificationsController';
import NOTIFICATION_TYPES from 'components/admin/Notifications/NotificationTypes';
import { resolveMafFileConflict, acknowledgeImportStatus } from 'components/admin/Model/actions/GenomicVariants';

import {
  AdminModalStyleWide,
  ModalWrapper,
  Header,
  Title,
  CloseModal,
  Content,
  Footer,
} from 'theme/adminModalStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { MessageLink } from 'theme/adminNotificationStyles';
import searchStyles from 'theme/searchStyles';

import { GDC_FILE_PAGE_URL_BASE, GDC_CANCER_MODEL_SAMPLE_TYPES } from 'utils/constants';

const confirmMafFileTableColumns = [
  {
    Header: 'Selection',
    accessor: 'selection',
    width: 73,
  },
  {
    Header: 'File Name',
    accessor: 'filename',
    width: 493,
  },
  {
    Header: 'Sample Type',
    accessor: 'sampleType',
    width: 259,
  },
  {
    Header: 'Tissue Type',
    accessor: 'tissueType',
    width: 89,
  },
  {
    Header: 'Tumor Descriptor',
    accessor: 'tumorDescriptor',
    width: 123,
  },
  {
    Header: 'Entity ID',
    accessor: 'entityId',
    width: 270,
  },
];

const getCancerModelEntity = entities => {
  return entities.find(entity => GDC_CANCER_MODEL_SAMPLE_TYPES.indexOf(entity.sampleType) > -1);
};

const doThenClose = (next, modalState) => async () => {
  await next();
  return modalState.setModalState({ component: null });
};

const ConfirmMafFileModal = ({
  title = 'Confirm MAF File to Import',
  confirmLabel = 'Import',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel = () => false,
  modelName,
  tissueStatus = 'N/A',
  files = [],
  notifications,
  appendNotification,
  importProgress,
  setImportProgress,
}) => {
  const defaultSelection = files.length !== 1 ? {
    fileId: null,
    filename: null,
  } : {
    fileId: files[0].fileId,
    filename: files[0].filename,
  };
  const [fileSelection, setFileSelection] = useState(defaultSelection);
  const [loading, setLoading] = useState(false);

  const onFileSelectionChange = value => {
    const filename = files.find(x => x.fileId === value).filename;
    setFileSelection({
      fileId: value,
      filename: filename,
    });
  };

  const getConfirmMafFileTableData = files => {
    return files.map(file => {
      const entity = getCancerModelEntity(file.entities);
      return {
        selection: (
          <label
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
            htmlFor={`confirm-maf-${file.fileId}`}
            aria-label={`Select file ${file.filename}`}
          >
            <input
              type="radio"
              id={`confirm-maf-${file.fileId}`}
              value={file.fileId}
              checked={fileSelection.fileId === file.fileId}
              onChange={e => {
                onFileSelectionChange(e.currentTarget.value);
              }}
              onClick={e => {
                onFileSelectionChange(e.currentTarget.value);
              }}
              style={{ cursor: 'pointer' }}
            />
          </label>
        ),
        filename: <MessageLink href={`${GDC_FILE_PAGE_URL_BASE}/${file.fileId}`} target="_blank" rel="noopener noreferrer">{file.filename}</MessageLink>,
        sampleType: entity.sampleType,
        tissueType: entity.tissueType,
        tumorDescriptor: entity.tumorDescriptor,
        entityId: entity.entitySubmitterId,
      };
    });
  };

  const confirmMafFile = async () => {
    setLoading(true);
    await resolveMafFileConflict(modelName, fileSelection.fileId, fileSelection.filename)
      .then(async _ => {
        const existingNotification = notifications.find(x => x.modelName === modelName);

        if (existingNotification) {
          existingNotification.clear();
        }

        if (onConfirm) {
          await onConfirm();
        }
      }).catch(error => {
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Import Error with No Action Required: An unexpected error occured while confirming a MAF file for ${modelName}`,
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
              The following files have been found in GDC for <strong>{`Model: ${modelName} | Tissue Status: ${tissueStatus}.`}</strong> Please select one file to import.
            </span>
            <div css={searchStyles}>
              <ReactTable
                className="-striped confirm-maf-table"
                columns={confirmMafFileTableColumns}
                data={getConfirmMafFileTableData(files)}
                pageSize={files.length}
                showPaginationBottom={false}
              />
            </div>
          </Content>
          <Footer>
            <ButtonPill
              primary
              marginRight={'10px'}
              disabled={!fileSelection.fileId || loading}
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

export default ({
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  modelName,
  tissueStatus,
  files,
}) => Component => (
  <NotificationsContext.Consumer>
    {({ notifications, appendNotification, importProgress, setImportProgress }) => (
  <ModalStateContext.Consumer>
    {modalState =>
      React.cloneElement(Component, {
        onClick: () => {
          modalState.setModalState({
            component: (
              <ConfirmMafFileModal
                {...{
                  title,
                  confirmLabel,
                  cancelLabel,
                  onConfirm,
                  onCancel,
                  modelName,
                  tissueStatus,
                  files,
                  notifications,
                  appendNotification,
                  importProgress,
                  setImportProgress,
                }}
              />
            ),
            shouldCloseOnOverlayClick: true,
            styles: AdminModalStyleWide,
          });
        },
      })
    }
  </ModalStateContext.Consumer>
    )}
  </NotificationsContext.Consumer>
);
