import React, { useContext, useEffect, useRef, useState } from 'react';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';
import {
  importGenomicVariants,
  clearGenomicVariants,
  GENOMIC_VARIANTS_IMPORT_ERRORS,
  MultipleMafError,
  NoMafError,
} from './actions/GenomicVariants';
import {
  NotificationsContext,
  NOTIFICATION_TYPES,
  useGenomicVariantImportNotifications,
} from './../Notifications';

import { Toolbar, DataTable, GenomicDataTable } from '../AdminTable';
import BulkUploader from '../BulkUpload';
import { ModelVariantColumns as clinicalVariantTableColumns } from './ModelVariantColumns';
import { ModelGenomicVariantColumns as genomicVariantTableColumns } from './ModelGenomicVariantColumns';
import { TabGroup, Tab } from 'components/layout/HorizontalTabs';
import PlusIcon from '../../../icons/PlusIcon';
import TabHeader from './TabHeader';
import useConfirmationModal from 'components/modals/ConfirmationModal';

import { AdminContainer, AdminHeader, AdminHeaderH3, AdminHeaderBlock } from 'theme/adminStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

import config from '../config';
import { VARIANT_IMPORT_STATUS, VARIANT_TYPES } from 'utils/constants';

const TabView = ({ activeTab, clinicalVariantsData, genomicVariantsData, modelName, type }) => {
  const {
    fetchGenomicVariantData,
    state: { variantTable, genomicVariantTable },
    variantTableControls,
    genomicVariantTableControls,
  } = useContext(ModelSingleContext);
  const { appendNotification } = useContext(NotificationsContext);

  switch (activeTab) {
    case VARIANT_TYPES.clinical:
      return (
        <Table marginBottom="0">
          <Toolbar
            {...{
              state: variantTable,
              type,
              onFilterValueChange: variantTableControls.onFilterValueChange,
            }}
          />
          <DataTable
            {...{
              state: { ...variantTable, data: clinicalVariantsData },
              variantTable,
              tableColumns: clinicalVariantTableColumns,
              onPageChange: variantTableControls.onPageChange,
              onPageSizeChange: variantTableControls.onPageSizeChange,
              toggleSelection: variantTableControls.toggleSelection,
              toggleAll: variantTableControls.toggleAll,
              disablePagination: true,
              simpleTableWithPagination: true,
            }}
          />
        </Table>
      );
    case VARIANT_TYPES.genomic:
      return (
        <Table marginBottom="0">
          <Toolbar
            {...{
              state: genomicVariantTable,
              type,
              onFilterValueChange: genomicVariantTableControls.onFilterValueChange,
            }}
          >
            {useConfirmationModal({
              title: 'Clear Existing Variants?',
              message: 'Are you sure you want to clear the existing list of variants?',
              confirmLabel: 'Yes, Clear',
              onConfirm: () =>
                clearGenomicVariants(modelName)
                  .then(_ => fetchGenomicVariantData(modelName))
                  .catch(error =>
                    appendNotification({
                      type: NOTIFICATION_TYPES.ERROR,
                      message: `Clear Error: An unexpected error occured while clearing research variants for ${modelName}`,
                      details: error.message,
                      timeout: false,
                    }),
                  ),
            })(
              <ButtonPill secondary css={'margin-right: 10px;'}>
                Clear List
              </ButtonPill>,
            )}
          </Toolbar>
          <GenomicDataTable
            {...{
              state: { ...genomicVariantTable, data: genomicVariantsData },
              onPageChange: genomicVariantTableControls.onPageChange,
              onPageSizeChange: genomicVariantTableControls.onPageSizeChange,
              tableColumns: genomicVariantTableColumns,
              toggleSelection: genomicVariantTableControls.toggleSelection,
              toggleAll: genomicVariantTableControls.toggleAll,
            }}
          />
        </Table>
      );
    default:
      return null;
  }
};

const isImporting = (importNotifications, modelName) => {
  return (importNotifications || []).find(activeImport => activeImport.modelName === modelName);
};

export default ({ data: { name, genomic_variants, variants, updatedAt } }) => {
  const importStatus = useRef(null);
  const { fetchGenomicVariantData } = useContext(ModelSingleContext);
  const { appendNotification } = useContext(NotificationsContext);
  const [activeTab, setActiveTab] = useState(null);
  const { importNotifications, addImportNotification } = useGenomicVariantImportNotifications();
  const clinicalVariantsData = variants.map(variant => ({
    _id: variant._id,
    variant_name: variant.variant.name,
    variant_type: variant.variant.type,
    assessment_type: variant.assessment_type,
    expression_level: variant.expression_level,
  }));
  const genomicVariantsData = (genomic_variants || []).filter(variant => variant.gene);
  const type = 'Variants';

  useEffect(() => {
    if (clinicalVariantsData.length > 0) {
      setActiveTab(VARIANT_TYPES.clinical);
    } else if (genomicVariantsData.length > 0) {
      setActiveTab(VARIANT_TYPES.genomic);
    }
  }, []);

  useEffect(() => {
    if (isImporting(importNotifications, name)) {
      importStatus.current = VARIANT_IMPORT_STATUS.active;
    }

    if (
      !isImporting(importNotifications, name) &&
      importStatus &&
      importStatus.current === VARIANT_IMPORT_STATUS.active
    ) {
      importStatus.current = VARIANT_IMPORT_STATUS.complete;
      fetchGenomicVariantData(name);
    }
  }, [importNotifications]);

  return (
    <>
      <TabHeader title={`Variants`} updatedAt={updatedAt} />
      <ModelSingleContext.Consumer>
        {({ attachVariants }) => (
          <AdminContainer p={'0'}>
            <AdminHeader
              css={`
                padding: 24px 10px 22px;
              `}
            >
              <AdminHeaderH3>
                Select the type of variant to add and import a variant list.
              </AdminHeaderH3>
              <AdminHeaderBlock>
                <ModalStateContext.Consumer>
                  {modalState => (
                    <>
                      <ButtonPill
                        primary
                        onClick={() =>
                          modalState.setModalState({
                            component: (
                              <BulkUploader
                                type={'variant'}
                                displayType={'clinical variant'}
                                onUpload={(sheetsURL, overwrite) =>
                                  attachVariants(sheetsURL, overwrite, name)
                                }
                                backupURL={`${config.urls.cmsBase}/action/backup-variants/${name}`}
                              />
                            ),
                            shouldCloseOnOverlayClick: true,
                            styles: AdminModalStyle,
                          })
                        }
                      >
                        <PlusIcon css={'margin-right: 5px;'} />
                        Clinical Variants
                      </ButtonPill>
                      <ButtonPill
                        primary
                        css={'margin-left: 10px;'}
                        disabled={importNotifications.find(
                          notification => notification.modelName === name,
                        )}
                        onClick={() => {
                          importGenomicVariants(name)
                            .then(async response => {
                              addImportNotification(name);
                            })
                            .catch(error => {
                              switch (error.code) {
                                case GENOMIC_VARIANTS_IMPORT_ERRORS.multipleMaf:
                                  appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: `Import Error: More than one MAF file was found in GDC for ${name}.`,
                                    details: <MultipleMafError files={error.files} />,
                                    timeout: false,
                                  });
                                  break;
                                case GENOMIC_VARIANTS_IMPORT_ERRORS.noMaf:
                                  appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: `Import Error: No MAF files found in GDC.`,
                                    details: <NoMafError caseId={error.case_id} modelName={name} />,
                                    timeout: false,
                                  });
                                  break;
                                case GENOMIC_VARIANTS_IMPORT_ERRORS.modelNotFound:
                                  appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: `Import Error: The model, ${name}, was not found in GDC.`,
                                    timeout: false,
                                  });
                                  break;
                                default:
                                  appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: `Import Error: An unexpected error occured while importing research variants for ${name}`,
                                    details: error.message,
                                    timeout: false,
                                  });
                                  break;
                              }
                            });
                        }}
                      >
                        <PlusIcon css={'margin-right: 5px;'} />
                        Research Somatic Variants
                      </ButtonPill>
                    </>
                  )}
                </ModalStateContext.Consumer>
              </AdminHeaderBlock>
            </AdminHeader>
            {(clinicalVariantsData.length > 0 || genomicVariantsData.length > 0) && (
              <>
                <TabGroup>
                  <Tab
                    active={activeTab === VARIANT_TYPES.clinical}
                    disabled={clinicalVariantsData.length === 0}
                    onClick={() => setActiveTab(VARIANT_TYPES.clinical)}
                  >
                    Clinical Variants
                  </Tab>
                  <Tab
                    active={activeTab === VARIANT_TYPES.genomic}
                    disabled={genomicVariantsData.length === 0}
                    onClick={() => setActiveTab(VARIANT_TYPES.genomic)}
                  >
                    Research Somatic Variants
                  </Tab>
                </TabGroup>
                <TabView
                  activeTab={activeTab}
                  clinicalVariantsData={clinicalVariantsData}
                  genomicVariantsData={genomicVariantsData}
                  modelName={name}
                  type={type}
                />
              </>
            )}
          </AdminContainer>
        )}
      </ModelSingleContext.Consumer>
    </>
  );
};
