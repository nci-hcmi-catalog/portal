import React from 'react';

import { ModelSingleContext } from './ModelSingleController';
import { ModalStateContext } from 'providers/ModalState';

import BulkUploader from '../BulkUpload';
import { Toolbar, DataTable } from '../AdminTable';
import { ModelVariantColumns as tableColumns } from './ModelVariantColumns';

import PlusIcon from '../../../icons/PlusIcon';

import { AdminContainer, AdminHeader, AdminHeaderH3, AdminHeaderBlock } from 'theme/adminStyles';
import { HoverPill } from 'theme/adminControlsStyles';
import { Table } from 'theme/adminTableStyles';
import { AdminModalStyle } from 'theme/adminModalStyles';
import config from '../config';
import TabHeader from './TabHeader';
export default ({ data: { name, variants, updatedAt } }) => {
  const data = variants.map(variant => ({
    _id: variant._id,
    variant_name: variant.variant.name,
    variant_type: variant.variant.type,
    assessment_type: variant.assessment_type,
    expression_level: variant.expression_level,
  }));

  const type = 'Variants';

  return (
    <>
      <TabHeader title={`Variants`} updatedAt={updatedAt} />
      <ModelSingleContext.Consumer>
        {({
          state: { variantTable },
          attachVariants,
          variantTableControls: {
            onFilterValueChange,
            onPageChange,
            onPageSizeChange,
            toggleSelection,
            toggleAll,
          },
        }) => (
          <AdminContainer p={'0'}>
            <AdminHeader
              css={`
                padding: 24px 10px 22px;
              `}
            >
              <AdminHeaderH3>
                {data.length > 0
                  ? 'Variant Data'
                  : 'Submit your variant data by selecting “Add Variants” and uploading a google sheet.'}
              </AdminHeaderH3>
              <AdminHeaderBlock>
                <ModalStateContext.Consumer>
                  {modalState => (
                    <HoverPill
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
                      <PlusIcon width={11} height={11} css={'margin-right: 5px;'} />
                      Add Variants
                    </HoverPill>
                  )}
                </ModalStateContext.Consumer>
              </AdminHeaderBlock>
            </AdminHeader>
            {data.length > 0 && (
              <Table marginBottom="0">
                <Toolbar {...{ state: variantTable, type, onFilterValueChange }} />
                <DataTable
                  {...{
                    state: { ...variantTable, data },
                    variantTable,
                    tableColumns,
                    onPageChange,
                    onPageSizeChange,
                    toggleSelection,
                    toggleAll,
                    disablePagination: true,
                    simpleTableWithPagination: true,
                  }}
                />
              </Table>
            )}
          </AdminContainer>
        )}
      </ModelSingleContext.Consumer>
    </>
  );
};
