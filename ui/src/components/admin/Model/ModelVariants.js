import React, { useContext, useEffect, useState } from 'react';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';
import {
  importGenomicVariants,
  GENOMIC_VARIANTS_IMPORT_ERRORS,
  MultipleMafError,
  NoMafError,
} from './actions/ImportGenomicVariants';
import { NotificationsContext, NOTIFICATION_TYPES } from './../Notifications';

import { Toolbar, DataTable, GenomicDataTable } from '../AdminTable';
import BulkUploader from '../BulkUpload';
import { ModelVariantColumns as clinicalVariantTableColumns } from './ModelVariantColumns';
import { ModelGenomicVariantColumns as genomicVariantTableColumns } from './ModelGenomicVariantColumns';
import { TabGroup, Tab } from 'components/layout/HorizontalTabs';
import PlusIcon from '../../../icons/PlusIcon';
import TabHeader from './TabHeader';

import { AdminContainer, AdminHeader, AdminHeaderH3, AdminHeaderBlock } from 'theme/adminStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';

import config from '../config';
import { VARIANT_TYPES } from 'utils/constants';

const TabView = ({ activeTab, clinicalVariantsData, genomicVariantsData, type }) => {
  const {
    state: { variantTable, genomicVariantTable },
    variantTableControls,
    genomicVariantTableControls,
  } = useContext(ModelSingleContext);

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
          />
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

export default ({ data: { name, genomic_variants, variants, updatedAt } }) => {
  const {
    appendNotification,
    clearNotification,
    importNotification,
    setImportNotification,
  } = useContext(NotificationsContext);
  const [activeTab, setActiveTab] = useState(null);
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
                        onClick={() => {
                          importGenomicVariants(name)
                            .then(async response => {
                              const notification = await appendNotification({
                                type: NOTIFICATION_TYPES.LOADING,
                                message: `Importing: Research Variants for ${name} are currently importing.`,
                                details:
                                  'You can continue to use the CMS, and will be notified when the import is complete.',
                                timeout: false,
                              });

                              setImportNotification(notification.id);
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
                      <ButtonPill
                        secondary
                        css={'margin-left: 10px;'}
                        disabled={!importNotification}
                        onClick={() => {
                          if (importNotification) {
                            clearNotification(importNotification);
                            setImportNotification(null);
                          }
                        }}
                      >
                        <PlusIcon css={'margin-right: 5px;'} />
                        Clear Import Notification
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
