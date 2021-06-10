import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';
import { importGenomicVariants, clearGenomicVariants } from './actions/GenomicVariants';
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
import CollapsibleArrow from 'icons/CollapsibleArrow';
import PlusIcon from 'icons/PlusIcon';
import VariantsIcon from 'icons/VariantsIcon';
import TabHeader from './TabHeader';
import useConfirmationModal from 'components/modals/ConfirmationModal';

import { DropdownItem } from 'theme/adminNavStyles';
import { AdminContainer, AdminHeader, AdminHeaderH3, AdminHeaderBlock } from 'theme/adminStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Table, ToolbarHeader } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

import config from '../config';
import {
  BULK_UPLOAD_TYPES,
  BULK_UPLOAD_DISPLAY_TYPES,
  VARIANT_IMPORT_STATUS,
  VARIANT_TYPES,
} from 'utils/constants';

const TabView = ({
  activeTab,
  clinicalVariantsData,
  genomicVariantsData,
  geneMeta,
  modelName,
  type,
}) => {
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
        <Table marginBottom="0" type={type}>
          <Toolbar
            {...{
              paginated: false,
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
        <Table marginBottom="0" type={type}>
          <ToolbarHeader hasData={genomicVariantsData.length > 0}>
            {geneMeta && (
              <>
                Imported: <b>{geneMeta.fileName}</b> on <b>{geneMeta.importDate}</b>
              </>
            )}
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
              <ButtonPill secondary css={'margin-left: 5px;'}>
                Clear List
              </ButtonPill>,
            )}
          </ToolbarHeader>
          {genomicVariantsData.length > 0 ? (
            <>
              <Toolbar
                {...{
                  state: genomicVariantTable,
                  type,
                  onFilterValueChange: genomicVariantTableControls.onFilterValueChange,
                }}
              />
              <GenomicDataTable
                {...{
                  state: { ...genomicVariantTable, data: genomicVariantsData },
                  onPageChange: genomicVariantTableControls.onPageChange,
                  onPageSizeChange: genomicVariantTableControls.onPageSizeChange,
                  tableColumns: genomicVariantTableColumns,
                  toggleSelection: genomicVariantTableControls.toggleSelection,
                  toggleAll: genomicVariantTableControls.toggleAll,
                  storageKey: 'cms-variants-somatic',
                }}
              />
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '230px',
              }}
            >
              <VariantsIcon />
              <p
                style={{
                  fontSize: '12px',
                }}
              >
                No variants identified in the Masked Somatic MAF.
              </p>
            </div>
          )}
        </Table>
      );
    default:
      return null;
  }
};

const isImporting = (importNotifications, modelName) => {
  return (importNotifications || []).find(activeImport => activeImport.modelName === modelName);
};

const getDateString = date => {
  if (!date) return null;

  return moment
    .utc(date)
    .local()
    .format('YYYY-MM-DD h:mm a');
};

export default ({ data: { name, gene_metadata, genomic_variants, variants, updatedAt } }) => {
  const importStatus = useRef(null);
  const { fetchGenomicVariantData } = useContext(ModelSingleContext);
  const [activeTab, setActiveTab] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    importNotifications,
    addImportNotification,
    showErrorImportNotification,
  } = useGenomicVariantImportNotifications();
  const clinicalVariantsData = variants.map(variant => ({
    _id: variant._id,
    variant_name: variant.variant.name,
    variant_type: variant.variant.type,
    assessment_type: variant.assessment_type,
    expression_level: variant.expression_level,
  }));
  const genomicVariantsData = (genomic_variants || []).filter(variant => variant.gene);
  const geneMeta =
    gene_metadata && gene_metadata.filename && gene_metadata.import_date
      ? {
          fileName: gene_metadata.filename,
          importDate: getDateString(gene_metadata.import_date),
        }
      : null;
  const type = 'Variants';

  useEffect(() => {
    if (clinicalVariantsData.length > 0) {
      setActiveTab(VARIANT_TYPES.clinical);
    } else if (genomicVariantsData.length > 0 || geneMeta) {
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
                                type={BULK_UPLOAD_TYPES.VARIANT}
                                displayType={BULK_UPLOAD_DISPLAY_TYPES.VARIANT}
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
                      <Popup
                        trigger={() => (
                          <div>
                            <ButtonPill
                              primary
                              css={'margin-left: 10px;'}
                              disabled={importNotifications.find(
                                notification => notification.modelName === name,
                              )}
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                              <PlusIcon css={'margin-right: 5px;'} />
                              Research Somatic Variants
                              <CollapsibleArrow
                                isOpen={dropdownOpen}
                                colour={'#000'}
                                weight={4}
                                css={`
                                  margin-left: 4px;
                                `}
                              />
                            </ButtonPill>
                          </div>
                        )}
                        offset={0}
                        open={dropdownOpen}
                        arrow={false}
                        onClose={() => setDropdownOpen(false)}
                      >
                        {useConfirmationModal({
                          title: 'Overwrite Existing Variants?',
                          message:
                            'Are you sure you want to import new research variants and overwrite the existing list?',
                          confirmLabel: 'Yes, Import',
                          onConfirm: () => {
                            importGenomicVariants(name)
                              .then(async _ => {
                                await addImportNotification(name);
                              })
                              .catch(error => {
                                const data = error.response ? error.response.data : error;
                                showErrorImportNotification(name, data);
                              });
                          },
                          confirmationRequired: genomicVariantsData.length > 0,
                        })(<DropdownItem>Automatic Import from GDC</DropdownItem>)}
                        <DropdownItem>Manual Import from GDC</DropdownItem>
                      </Popup>
                    </>
                  )}
                </ModalStateContext.Consumer>
              </AdminHeaderBlock>
            </AdminHeader>
            {(clinicalVariantsData.length > 0 || (genomicVariantsData.length > 0 || geneMeta)) && (
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
                    disabled={genomicVariantsData.length === 0 && !geneMeta}
                    onClick={() => setActiveTab(VARIANT_TYPES.genomic)}
                  >
                    Research Somatic Variants
                  </Tab>
                </TabGroup>
                <TabView
                  activeTab={activeTab}
                  clinicalVariantsData={clinicalVariantsData}
                  genomicVariantsData={genomicVariantsData}
                  geneMeta={geneMeta}
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
